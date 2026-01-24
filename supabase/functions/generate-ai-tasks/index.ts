import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FlowAnalysis {
  flow_id: string
  flow_name: string
  overall_score: number
  conversion_score: number
  quick_wins: string[] | null
  ai_recommendations: string[] | null
}

interface FlowIssue {
  id: string
  flow_id: string
  title: string
  category: string
  severity: string
  description: string | null
  recommendation: string | null
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const body = await req.json().catch(() => ({}))
    const { founder_notes, force_generate } = body as { 
      founder_notes?: string
      force_generate?: boolean 
    }

    // 1. Fetch latest flow analyses (top 5 by date)
    const { data: flowAnalyses, error: flowError } = await supabase
      .from('flow_analysis_runs')
      .select('flow_id, flow_name, overall_score, conversion_score, quick_wins, ai_recommendations')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(5)

    if (flowError) {
      console.error('Flow analysis error:', flowError)
    }

    // 2. Fetch unresolved UX issues
    const { data: unresolvedIssues, error: issuesError } = await supabase
      .from('flow_ux_issues')
      .select('id, flow_id, title, category, severity, description, recommendation')
      .eq('is_resolved', false)
      .order('severity', { ascending: true }) // critical first
      .limit(10)

    if (issuesError) {
      console.error('Issues error:', issuesError)
    }

    // 3. Fetch latest feature scores for context
    const { data: featureScores, error: scoresError } = await supabase
      .from('flow_feature_scores')
      .select('flow_id, overall_score, trust_score, cta_score, mobile_score, issues_count')
      .order('created_at', { ascending: false })
      .limit(3)

    if (scoresError) {
      console.error('Feature scores error:', scoresError)
    }

    // 4. Build context for ChatGPT
    const analysisContext = {
      flows: (flowAnalyses || []).map((f: FlowAnalysis) => ({
        name: f.flow_name,
        score: f.overall_score,
        conversion: f.conversion_score,
        quick_wins: f.quick_wins,
        recommendations: f.ai_recommendations,
      })),
      issues: (unresolvedIssues || []).map((i: FlowIssue) => ({
        title: i.title,
        category: i.category,
        severity: i.severity,
        recommendation: i.recommendation,
      })),
      feature_scores: featureScores || [],
      low_score_flows: (flowAnalyses || []).filter((f: FlowAnalysis) => f.overall_score < 80),
    }

    // 5. Build the ChatGPT prompt
    const systemPrompt = `Du bist ein Projektmanager + UX/CRO Lead für umzugscheck.ch (Schweizer Umzugsvergleichsportal).

ZIEL: Generiere konkrete, ausführbare Tasks für zwei AI-Agenten basierend auf den Analytics-Daten.

AGENTEN:
1. CODEX (Architekt): Neue Features, Komponenten, Business Logic
   - Erlaubt: src/components/, src/hooks/, src/lib/, src/pages/, supabase/functions/
   - Nicht: src/components/ui/, index.css, tailwind.config.ts

2. COPILOT (Polierer): Styling, Fixes, Optimierungen
   - Erlaubt: index.css, tailwind.config.ts, src/components/ui/, bestehende Komponenten
   - Nicht: Neue Dateien erstellen, Business Logic

REGELN:
- Max 1 Task pro Agent
- Priorisiere: CTA-Klarheit, Trust-Signale, Mobile UX
- Swiss-Kontext: de-CH, CHF, ASTAG
- Tasks müssen konkret und ausführbar sein

OUTPUT FORMAT (nur gültiges JSON, keine anderen Zeichen):
{"codex_task":{"title":"Kurzer Titel","description":"Detaillierte Beschreibung mit Akzeptanzkriterien","files":["src/path/file.tsx"]},"copilot_task":{"title":"Kurzer Titel","description":"Detaillierte Beschreibung mit Akzeptanzkriterien","files":["src/path/existing.tsx"]},"summary":"Sprint-Zusammenfassung","priority_reasoning":"Warum diese Tasks Priorität haben"}`

    const userPrompt = `ANALYTICS-DATEN:

FLOW-ANALYSEN:
${JSON.stringify(analysisContext.flows, null, 2)}

OFFENE ISSUES (${analysisContext.issues.length}):
${JSON.stringify(analysisContext.issues, null, 2)}

FLOWS MIT SCORE < 80 (Kritisch):
${analysisContext.low_score_flows.length > 0 
  ? JSON.stringify(analysisContext.low_score_flows, null, 2) 
  : 'Keine - alle Flows haben gute Scores!'}

${founder_notes ? `FOUNDER NOTES (PRIORISIEREN!):
${founder_notes}` : ''}

Generiere jetzt die optimalen CODEX und COPILOT Tasks basierend auf diesen Daten.`

    // 6. Call OpenAI
    if (!openaiKey) {
      return new Response(JSON.stringify({
        error: 'OpenAI API key not configured',
        context: analysisContext, // Return context for debugging
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI error:', errorText)
      return new Response(JSON.stringify({
        error: 'OpenAI API error',
        details: errorText,
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const openaiData = await openaiResponse.json()
    const rawContent = openaiData.choices?.[0]?.message?.content || ''
    
    console.log('OpenAI raw response:', rawContent)

    // 7. Parse the response
    let parsedTasks: {
      codex_task?: { title: string; description: string; files?: string[] }
      copilot_task?: { title: string; description: string; files?: string[] }
      summary?: string
      priority_reasoning?: string
    } = {}

    try {
      // Try to extract JSON from the response
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedTasks = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Parse error:', parseError)
      return new Response(JSON.stringify({
        error: 'Failed to parse ChatGPT response',
        raw_response: rawContent,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 8. Insert tasks into queue
    const insertedTasks: string[] = []

    if (parsedTasks.codex_task?.title && parsedTasks.codex_task?.description) {
      const { data: codexTask, error: codexError } = await supabase
        .from('ai_task_queue')
        .insert({
          agent: 'codex',
          title: parsedTasks.codex_task.title,
          description: parsedTasks.codex_task.description,
          prompt: parsedTasks.codex_task.description,
          target_files: parsedTasks.codex_task.files || [],
          priority: 7,
          source: 'ai-generator',
          status: 'pending',
        })
        .select()
        .single()

      if (codexError) {
        console.error('CODEX insert error:', codexError)
      } else {
        insertedTasks.push(codexTask.id)
      }
    }

    if (parsedTasks.copilot_task?.title && parsedTasks.copilot_task?.description) {
      const { data: copilotTask, error: copilotError } = await supabase
        .from('ai_task_queue')
        .insert({
          agent: 'copilot',
          title: parsedTasks.copilot_task.title,
          description: parsedTasks.copilot_task.description,
          prompt: parsedTasks.copilot_task.description,
          target_files: parsedTasks.copilot_task.files || [],
          priority: 6,
          source: 'ai-generator',
          status: 'pending',
        })
        .select()
        .single()

      if (copilotError) {
        console.error('COPILOT insert error:', copilotError)
      } else {
        insertedTasks.push(copilotTask.id)
      }
    }

    // 9. Sync pending tasks to GitHub as Markdown
    let githubSyncResult = { synced: false, error: null as string | null }
    const githubToken = Deno.env.get('GITHUB_TOKEN')
    
    if (githubToken && insertedTasks.length > 0) {
      try {
        // Fetch all pending tasks for markdown export
        const { data: pendingTasks, error: pendingError } = await supabase
          .from('ai_task_queue')
          .select('*')
          .eq('status', 'pending')
          .order('priority', { ascending: false })
          .order('created_at', { ascending: true })

        if (!pendingError && pendingTasks) {
          const codexTasks = pendingTasks.filter(t => t.agent === 'codex')
          const copilotTasks = pendingTasks.filter(t => t.agent === 'copilot')

          // Generate markdown content
          const now = new Date().toISOString()
          
          const generateMarkdown = (tasks: typeof pendingTasks, agentName: string) => {
            if (tasks.length === 0) return `# 🤖 Pending ${agentName.toUpperCase()} Tasks\n\nGenerated: ${now}\n\n---\n\n_No pending tasks._\n`
            
            let md = `# 🤖 Pending ${agentName.toUpperCase()} Tasks\n\nGenerated: ${now}\n\n---\n\n`
            
            tasks.forEach((task, index) => {
              md += `## Task ${index + 1}: ${task.title}\n\n`
              md += `**Priority**: ${task.priority || 'normal'}\n\n`
              if (task.target_files?.length) {
                md += `**Target Files:**\n${task.target_files.map((f: string) => `- \`${f}\``).join('\n')}\n\n`
              }
              md += `### Instructions:\n\n${task.prompt}\n\n---\n\n`
            })
            
            return md
          }

          const codexMarkdown = generateMarkdown(codexTasks, 'CODEX')
          const copilotMarkdown = generateMarkdown(copilotTasks, 'COPILOT')

          // Push to GitHub
          const owner = 'manuelfafl'
          const repo = 'umzugscheck.ch'
          const branch = 'main'

          const pushToGitHub = async (path: string, content: string) => {
            // First, try to get existing file SHA
            const getResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
              headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Lovable-AI-Task-Sync',
              },
            })

            let sha: string | undefined
            if (getResponse.ok) {
              const existing = await getResponse.json()
              sha = existing.sha
            }

            // Create or update file
            const putResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Lovable-AI-Task-Sync',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: `🤖 Auto-sync: Update ${path.split('/').pop()}`,
                content: btoa(unescape(encodeURIComponent(content))),
                branch,
                ...(sha ? { sha } : {}),
              }),
            })

            if (!putResponse.ok) {
              const errorText = await putResponse.text()
              throw new Error(`GitHub API error: ${putResponse.status} - ${errorText}`)
            }

            return true
          }

          await Promise.all([
            pushToGitHub('docs/tasks/PENDING_CODEX.md', codexMarkdown),
            pushToGitHub('docs/tasks/PENDING_COPILOT.md', copilotMarkdown),
          ])

          githubSyncResult = { synced: true, error: null }
          console.log('✅ Successfully synced tasks to GitHub')
        }
      } catch (syncError) {
        console.error('GitHub sync error:', syncError)
        githubSyncResult = { 
          synced: false, 
          error: syncError instanceof Error ? syncError.message : 'Unknown sync error' 
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      tasks_created: insertedTasks.length,
      task_ids: insertedTasks,
      summary: parsedTasks.summary,
      priority_reasoning: parsedTasks.priority_reasoning,
      github_sync: githubSyncResult,
      context_used: {
        flows_analyzed: analysisContext.flows.length,
        issues_considered: analysisContext.issues.length,
        low_score_alerts: analysisContext.low_score_flows.length,
        founder_notes_included: !!founder_notes,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Generate tasks error:', error)
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
