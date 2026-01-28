import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const url = new URL(req.url)
  const action = url.pathname.split('/').pop()
  
  // Helper to log webhook calls
  async function logWebhook(endpoint: string, method: string, payload: unknown, success: boolean, errorMessage?: string, responseData?: unknown) {
    try {
      await supabase.from('ai_task_webhook_logs').insert({
        endpoint,
        method,
        payload: payload as Record<string, unknown>,
        success,
        error_message: errorMessage || null,
        response_data: responseData as Record<string, unknown> || null,
        source_ip: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || null,
      })
    } catch (e) {
      console.error('Failed to log webhook:', e)
    }
  }

  try {
    // POST /ai-task-webhook - Zapier sendet neue Tasks
    if (req.method === 'POST' && (!action || action === 'ai-task-webhook')) {
      const body = await req.json()
      
      // Log incoming request
      await logWebhook('/ai-task-webhook', 'POST', body, true)

      // Allow invoking actions via POST body (frontend-friendly)
      // Example: { action: 'next', agent: 'codex' }
      if (body?.action) {
        const requestedAction = String(body.action)

        if (requestedAction === 'next') {
          const agent = body.agent
          const autoGenerate = body.auto_generate !== false // Default: true

          if (!agent || !['codex', 'copilot'].includes(agent)) {
            return new Response(JSON.stringify({ error: 'agent must be codex or copilot' }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          // First, check for pending tasks
          let { data, error } = await supabase
            .from('ai_task_queue')
            .select('*')
            .eq('agent', agent)
            .eq('status', 'pending')
            .order('priority', { ascending: false })
            .order('created_at', { ascending: true })
            .limit(1)
            .single()

          if (error && error.code !== 'PGRST116') throw error

          // Auto-generate if queue is empty and auto_generate is enabled
          if (!data && autoGenerate) {
            console.log(`📭 No pending ${agent} tasks - triggering auto-generate...`)
            
            // Check if there are ANY pending tasks (for either agent)
            const { count: totalPending } = await supabase
              .from('ai_task_queue')
              .select('*', { count: 'exact', head: true })
              .eq('status', 'pending')
            
            // Only auto-generate if the entire queue is empty
            if (totalPending === 0) {
              try {
                // Call generate-ai-tasks function
                const generateResponse = await fetch(`${supabaseUrl}/functions/v1/generate-ai-tasks`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    founder_notes: 'Auto-generated: Queue was empty, generating new tasks based on latest analysis.',
                    force_generate: true,
                  }),
                })

                if (generateResponse.ok) {
                  const generateResult = await generateResponse.json()
                  console.log(`✅ Auto-generated ${generateResult.tasks_created} new tasks`)
                  
                  // Wait a moment for DB consistency
                  await new Promise(r => setTimeout(r, 500))
                  
                  // Try to fetch the newly created task
                  const retry = await supabase
                    .from('ai_task_queue')
                    .select('*')
                    .eq('agent', agent)
                    .eq('status', 'pending')
                    .order('priority', { ascending: false })
                    .order('created_at', { ascending: true })
                    .limit(1)
                    .single()
                  
                  if (!retry.error) {
                    data = retry.data
                  }
                } else {
                  console.error('Auto-generate failed:', await generateResponse.text())
                }
              } catch (genError) {
                console.error('Auto-generate error:', genError)
              }
            }
          }

          if (!data) {
            return new Response(JSON.stringify({
              message: `Keine pending Tasks für ${agent}`,
              prompt: null,
              auto_generate_attempted: autoGenerate,
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          await supabase
            .from('ai_task_queue')
            .update({ status: 'in_progress', started_at: new Date().toISOString() })
            .eq('id', data.id)

          return new Response(JSON.stringify({
            task_id: data.id,
            title: data.title,
            prompt: data.prompt,
            target_files: data.target_files,
            message: 'Kopiere den Prompt und füge ihn in den Agent ein',
            auto_generated: !!(body.auto_generate !== false && data.source === 'ai-generator'),
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (requestedAction === 'complete') {
          const { task_id, output_summary, files_changed } = body

          if (!task_id) {
            return new Response(JSON.stringify({ error: 'task_id required' }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          const { error } = await supabase
            .from('ai_task_queue')
            .update({
              status: 'done',
              completed_at: new Date().toISOString(),
              output_summary: output_summary || null,
              files_changed: files_changed || [],
            })
            .eq('id', task_id)

          if (error) throw error

          return new Response(JSON.stringify({ success: true, task_id }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (requestedAction === 'pending') {
          const { data, error } = await supabase
            .from('ai_task_queue')
            .select('id, agent, title, priority, created_at')
            .eq('status', 'pending')
            .order('priority', { ascending: false })
            .order('created_at', { ascending: true })

          if (error) throw error

          return new Response(JSON.stringify({
            count: data.length,
            codex: data.filter(t => t.agent === 'codex'),
            copilot: data.filter(t => t.agent === 'copilot'),
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (requestedAction === 'debug-last') {
          const { data, error } = await supabase
            .from('ai_task_webhook_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5)

          if (error) throw error

          return new Response(JSON.stringify({
            message: 'Letzte 5 Webhook-Aufrufe',
            logs: data,
            hint: 'Schau dir payload und error_message an um Zapier-Probleme zu debuggen',
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (requestedAction === 'stats') {
          const { data: tasks, error } = await supabase
            .from('ai_task_queue')
            .select('agent, status')

          if (error) throw error

          const stats = {
            total: tasks.length,
            pending: tasks.filter(t => t.status === 'pending').length,
            in_progress: tasks.filter(t => t.status === 'in_progress').length,
            done: tasks.filter(t => t.status === 'done').length,
            codex_pending: tasks.filter(t => t.agent === 'codex' && t.status === 'pending').length,
            copilot_pending: tasks.filter(t => t.agent === 'copilot' && t.status === 'pending').length,
          }

          return new Response(JSON.stringify(stats), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        return new Response(JSON.stringify({
          error: 'Unknown action',
          available_actions: ['next', 'complete', 'pending', 'debug-last', 'stats'],
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      // Unterstützt mehrere Formate:
      // Format 1: { raw_output: "JSON string from ChatGPT", zapier_run_id }
      // Format 2: { codex_task, copilot_task, summary, zapier_run_id }
      // Format 3: OpenAI Completion API { choices: [{ text: "JSON string" }] }
      // Format 4: { action: "create", task: { agent, title, prompt, ... } }
      
      let codex_task, copilot_task, summary
      const { zapier_run_id } = body
      
      // Helper to extract JSON from various text formats
      function extractJsonFromText(text: string): unknown | null {
        // Try direct parse first
        try {
          return JSON.parse(text)
        } catch {
          // Try to find JSON object in text
          const jsonMatch = text.match(/\{[\s\S]*"codex_task"[\s\S]*\}/)
          if (jsonMatch) {
            try {
              return JSON.parse(jsonMatch[0])
            } catch {
              return null
            }
          }
          return null
        }
      }

      // Format 4: Direct task creation (for scheduled tasks / direct API)
      if (body.action === 'create' && body.task) {
        const task = body.task
        if (!task.agent || !['codex', 'copilot'].includes(task.agent)) {
          return new Response(JSON.stringify({ error: 'task.agent must be codex or copilot' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        if (!task.title || !task.prompt) {
          return new Response(JSON.stringify({ error: 'task.title and task.prompt are required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        const { data, error } = await supabase
          .from('ai_task_queue')
          .insert({
            agent: task.agent,
            title: task.title,
            description: task.description || null,
            prompt: task.prompt,
            target_files: task.target_files || task.files || [],
            priority: task.priority || 5,
            source: task.source || 'api',
            zapier_run_id: zapier_run_id || null,
          })
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({
          success: true,
          task_id: data.id,
          message: `Task für ${task.agent} erstellt`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Format 3: OpenAI Completion API format { choices: [{ text: "..." }] }
      if (body.choices && Array.isArray(body.choices) && body.choices[0]?.text) {
        console.log('Detected OpenAI Completion format')
        const rawText = body.choices[0].text
        
        // OpenAI might return multiple JSON objects, take the first valid one
        const allJsonMatches = rawText.match(/\{[^{}]*"codex_task"[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g) || []
        
        let parsed = null
        for (const match of allJsonMatches) {
          parsed = extractJsonFromText(match)
          if (parsed && (parsed as Record<string, unknown>).codex_task) break
        }
        
        // Fallback: try entire text
        if (!parsed) {
          parsed = extractJsonFromText(rawText)
        }
        
        if (parsed && typeof parsed === 'object') {
          codex_task = (parsed as Record<string, unknown>).codex_task
          copilot_task = (parsed as Record<string, unknown>).copilot_task
          summary = (parsed as Record<string, unknown>).summary
        } else {
          await logWebhook('/ai-task-webhook', 'POST', body, false, 'Could not parse JSON from OpenAI choices.text')
          return new Response(JSON.stringify({
            error: 'Could not parse JSON from choices.text',
            hint: 'Ensure ChatGPT outputs valid JSON with codex_task and copilot_task',
            received_preview: rawText.substring(0, 500)
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
      } else if (body.raw_output) {
        // Format 1: Parse raw ChatGPT output (could be string or already parsed)
        try {
          const parsed = typeof body.raw_output === 'string' 
            ? JSON.parse(body.raw_output) 
            : body.raw_output
          codex_task = parsed.codex_task
          copilot_task = parsed.copilot_task
          summary = parsed.summary
        } catch (e) {
          console.error('Failed to parse raw_output:', e)
          await logWebhook('/ai-task-webhook', 'POST', body, false, 'Invalid JSON in raw_output')
          return new Response(JSON.stringify({ 
            error: 'Invalid JSON in raw_output',
            received: body.raw_output 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
      } else {
        // Format 2: Direct format
        codex_task = body.codex_task
        copilot_task = body.copilot_task
        summary = body.summary
      }
      
      const tasksToInsert = []
      
      if (codex_task?.title) {
        tasksToInsert.push({
          agent: 'codex',
          title: codex_task.title,
          description: codex_task.description || summary,
          prompt: generateCodexPrompt(codex_task),
          target_files: codex_task.files || [],
          priority: 5,
          source: 'zapier',
          zapier_run_id: zapier_run_id || null,
        })
      }
      
      if (copilot_task?.title) {
        tasksToInsert.push({
          agent: 'copilot',
          title: copilot_task.title,
          description: copilot_task.description || summary,
          prompt: generateCopilotPrompt(copilot_task),
          target_files: copilot_task.files || [],
          priority: 5,
          source: 'zapier',
          zapier_run_id: zapier_run_id || null,
        })
      }

      if (tasksToInsert.length > 0) {
        const { data, error } = await supabase
          .from('ai_task_queue')
          .insert(tasksToInsert)
          .select()

        if (error) {
          await logWebhook('/ai-task-webhook', 'POST', body, false, error.message)
          throw error
        }

        const response = { 
          success: true, 
          tasks_created: data.length,
          task_ids: data.map(t => t.id),
          summary: summary || null
        }
        
        await logWebhook('/ai-task-webhook', 'POST', body, true, undefined, response)

        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const response = { 
        success: true, 
        tasks_created: 0,
        message: 'No valid tasks in payload',
        received_keys: Object.keys(body)
      }
      
      await logWebhook('/ai-task-webhook', 'POST', body, true, undefined, response)

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // GET /ai-task-webhook/next?agent=codex|copilot
    if (req.method === 'GET' && action === 'next') {
      const agent = url.searchParams.get('agent')
      const autoGenerate = url.searchParams.get('auto_generate') !== 'false' // Default: true
      
      if (!agent || !['codex', 'copilot'].includes(agent)) {
        return new Response(JSON.stringify({ error: 'agent must be codex or copilot' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      let { data, error } = await supabase
        .from('ai_task_queue')
        .select('*')
        .eq('agent', agent)
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      // Auto-generate if queue is empty for this agent
      if (!data && autoGenerate) {
        console.log(`📭 [GET] No pending ${agent} tasks - triggering auto-generate...`)
        
        // Check if there are ANY pending tasks (for either agent)
        const { count: totalPending } = await supabase
          .from('ai_task_queue')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
        
        // Only auto-generate if the entire queue is empty
        if (totalPending === 0) {
          try {
            const generateResponse = await fetch(`${supabaseUrl}/functions/v1/generate-ai-tasks`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                founder_notes: 'Auto-generated: Queue was empty, generating new tasks based on latest analysis.',
                force_generate: true,
              }),
            })

            if (generateResponse.ok) {
              const generateResult = await generateResponse.json()
              console.log(`✅ [GET] Auto-generated ${generateResult.tasks_created} new tasks`)
              
              await new Promise(r => setTimeout(r, 500))
              
              const retry = await supabase
                .from('ai_task_queue')
                .select('*')
                .eq('agent', agent)
                .eq('status', 'pending')
                .order('priority', { ascending: false })
                .order('created_at', { ascending: true })
                .limit(1)
                .single()
              
              if (!retry.error) {
                data = retry.data
              }
            } else {
              console.error('[GET] Auto-generate failed:', await generateResponse.text())
            }
          } catch (genError) {
            console.error('[GET] Auto-generate error:', genError)
          }
        }
      }

      if (!data) {
        return new Response(JSON.stringify({ 
          message: `Keine pending Tasks für ${agent}`,
          prompt: null,
          auto_generate_attempted: autoGenerate,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Mark as in_progress
      await supabase
        .from('ai_task_queue')
        .update({ status: 'in_progress', started_at: new Date().toISOString() })
        .eq('id', data.id)

      return new Response(JSON.stringify({
        task_id: data.id,
        title: data.title,
        prompt: data.prompt,
        target_files: data.target_files,
        message: 'Kopiere den Prompt und füge ihn in den Agent ein'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // POST /ai-task-webhook/complete
    if (req.method === 'POST' && action === 'complete') {
      const { task_id, output_summary, files_changed } = await req.json()

      if (!task_id) {
        return new Response(JSON.stringify({ error: 'task_id required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { error } = await supabase
        .from('ai_task_queue')
        .update({ 
          status: 'done', 
          completed_at: new Date().toISOString(),
          output_summary: output_summary || null,
          files_changed: files_changed || []
        })
        .eq('id', task_id)

      if (error) throw error

      return new Response(JSON.stringify({ success: true, task_id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // GET /ai-task-webhook/pending - Alle pending Tasks
    if (req.method === 'GET' && action === 'pending') {
      const { data, error } = await supabase
        .from('ai_task_queue')
        .select('id, agent, title, priority, created_at')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })

      if (error) throw error

      return new Response(JSON.stringify({ 
        count: data.length,
        codex: data.filter(t => t.agent === 'codex'),
        copilot: data.filter(t => t.agent === 'copilot')
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // GET /ai-task-webhook/debug-last - Last 5 webhook calls for debugging
    if (req.method === 'GET' && action === 'debug-last') {
      const { data, error } = await supabase
        .from('ai_task_webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error

      return new Response(JSON.stringify({
        message: 'Letzte 5 Webhook-Aufrufe',
        logs: data,
        hint: 'Schau dir payload und error_message an um Zapier-Probleme zu debuggen'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // GET /ai-task-webhook/stats - Quick stats
    if (req.method === 'GET' && action === 'stats') {
      const { data: tasks, error } = await supabase
        .from('ai_task_queue')
        .select('agent, status')

      if (error) throw error

      const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        done: tasks.filter(t => t.status === 'done').length,
        codex_pending: tasks.filter(t => t.agent === 'codex' && t.status === 'pending').length,
        copilot_pending: tasks.filter(t => t.agent === 'copilot' && t.status === 'pending').length,
      }

      return new Response(JSON.stringify(stats), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Unknown action', available: ['POST /', 'GET /next?agent=', 'POST /complete', 'GET /pending', 'GET /debug-last', 'GET /stats'] }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

// Generiert den vollständigen CODEX Prompt
function generateCodexPrompt(task: { title: string; description?: string; files?: string[] }): string {
  return `Du bist CODEX für umzugscheck.ch - ein Schweizer Umzugsvergleichsportal.

DEINE ROLLE: Architekt - Neue Features & komplexe Logik

## AKTUELLE AUFGABE
**${task.title}**
${task.description || ''}

${task.files?.length ? `**Zieldateien:** ${task.files.join(', ')}` : ''}

## KONTEXT-DATEIEN (lies diese zuerst)
- docs/strategic-analysis-v9-archetyp.md (Archetypen & Swiss-Markt)
- ARCHITECTURE.md (Tech-Stack)
- docs/prompts/CODEX_COPILOT_WORKFLOW.md (Arbeitsteilung)

## DEIN ARBEITSBEREICH
✅ src/components/ (neue Komponenten erstellen)
✅ src/hooks/ (Custom Hooks)
✅ src/lib/ (Business Logic)
✅ src/pages/ (neue Seiten)
✅ supabase/functions/ (Edge Functions)

🚫 NICHT ANFASSEN:
- src/components/ui/ (Copilot-Bereich)
- index.css, tailwind.config.ts
- Bestehende Styling-Fixes

## REGELN
1. Neue Dateien erstellen, nicht bestehende editieren (außer eigene)
2. Immer TypeScript mit strikten Typen
3. Komponenten klein & fokussiert halten
4. Semantic Tokens aus Tailwind verwenden (keine hardcoded Farben)
5. Swiss-Markt beachten: ASTAG, DSG, de-CH Locale

## ARCHETYPEN (für UX-Entscheidungen)
- Sicherheitssucher: Vertrauen, Zertifikate, Garantien
- Effizienz-Profi: Schnell, klar, keine Ablenkung
- Preisoptimierer: Vergleiche, Transparenz, Einsparungen
- Überforderter Umzieher: Einfach, geführt, beruhigend

## WENN FERTIG
Antworte mit: TASK_COMPLETE: [Zusammenfassung was du gemacht hast]`
}

// Generiert den vollständigen COPILOT Prompt
function generateCopilotPrompt(task: { title: string; description?: string; files?: string[] }): string {
  return `Du bist COPILOT für umzugscheck.ch - ein Schweizer Umzugsvergleichsportal.

DEINE ROLLE: Polierer - Styling, Fixes, Optimierungen

## AKTUELLE AUFGABE
**${task.title}**
${task.description || ''}

${task.files?.length ? `**Zieldateien:** ${task.files.join(', ')}` : ''}

## KONTEXT-DATEIEN
- PRODUCTION_CHECKLIST.md (Was ist done)
- docs/prompts/CODEX_COPILOT_WORKFLOW.md (Arbeitsteilung)

## DEIN ARBEITSBEREICH
✅ index.css (Design Tokens, CSS Variablen)
✅ tailwind.config.ts (Theme-Erweiterungen)
✅ src/components/ui/ (Shadcn-Anpassungen)
✅ Bestehende Komponenten: NUR Styling-Fixes
✅ TypeScript-Typen verbessern

🚫 NICHT ANFASSEN:
- Neue Dateien erstellen (Codex-Bereich)
- Business Logic ändern
- src/hooks/, src/lib/ Logik
- Edge Functions

## REGELN
1. Nur in bestehenden Dateien arbeiten
2. Semantic Tokens verwenden: --primary, --background, --muted etc.
3. Alle Farben als HSL in index.css
4. Mobile-first (min-h-[44px] Touch Targets)
5. WCAG 2.1 AA Kontraste einhalten

## DESIGN-SYSTEM
- Primärfarbe: Swiss Blue
- Trust-Signale: Grün für Verified, Gold für Premium
- Spacing: 4px Basis-Grid
- Border-Radius: rounded-lg Standard
- Immer Dark Mode mitdenken!

## WENN FERTIG
Antworte mit: TASK_COMPLETE: [Zusammenfassung was du gemacht hast]`
}
