import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Format URL - always prefer https
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    // Force https if http was provided
    if (formattedUrl.startsWith('http://')) {
      formattedUrl = formattedUrl.replace('http://', 'https://');
    }

    console.log('Extracting project info from:', formattedUrl);

    // Step 1: Scrape the website content
    let websiteContent = '';
    let title = '';

    const scrapeWithFirecrawl = async (urlToScrape: string): Promise<{content: string, title: string}> => {
      if (!FIRECRAWL_API_KEY) return { content: '', title: '' };
      
      try {
        const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: urlToScrape,
            formats: ['markdown'],
            onlyMainContent: true,
            waitFor: 3000,
          }),
        });

        if (scrapeResponse.ok) {
          const scrapeData = await scrapeResponse.json();
          const content = scrapeData.data?.markdown || scrapeData.markdown || '';
          const pageTitle = scrapeData.data?.metadata?.title || scrapeData.metadata?.title || '';
          return { content, title: pageTitle };
        }
      } catch (e) {
        console.error('Firecrawl error:', e);
      }
      return { content: '', title: '' };
    };

    if (FIRECRAWL_API_KEY) {
      console.log('Using Firecrawl to scrape website...');
      const result = await scrapeWithFirecrawl(formattedUrl);
      websiteContent = result.content;
      title = result.title;
      console.log('Firecrawl scrape result, content length:', websiteContent.length);
      
      // Check if content is too short or contains error indicators
      const isErrorPage = websiteContent.length < 500 || 
        websiteContent.toLowerCase().includes('project not found') ||
        websiteContent.toLowerCase().includes('page not found') ||
        websiteContent.toLowerCase().includes('404');
      
      if (isErrorPage) {
        console.log('Detected error page or too short content, trying www subdomain...');
        // Try with www subdomain
        const wwwUrl = formattedUrl.replace('https://', 'https://www.');
        if (!formattedUrl.includes('://www.')) {
          const wwwResult = await scrapeWithFirecrawl(wwwUrl);
          if (wwwResult.content.length > websiteContent.length) {
            websiteContent = wwwResult.content;
            title = wwwResult.title;
            console.log('www subdomain returned better content:', websiteContent.length);
          }
        }
      }
    }

    // Fallback: Simple HTML fetch if Firecrawl fails or not available
    if (!websiteContent) {
      console.log('Fallback: Fetching HTML directly...');
      try {
        const htmlResponse = await fetch(formattedUrl, {
          headers: { 
            'User-Agent': 'Mozilla/5.0 (compatible; AnalysisBot/1.0)',
            'Accept': 'text/html'
          }
        });
        if (htmlResponse.ok) {
          const html = await htmlResponse.text();
          // Extract title
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          title = titleMatch ? titleMatch[1].trim() : '';
          // Extract text content (simplified)
          websiteContent = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 15000);
          console.log('Direct HTML fetch successful');
        }
      } catch (htmlError) {
        console.error('HTML fetch failed:', htmlError);
      }
    }

    // Step 2: Use AI to extract project information
    const systemPrompt = `Du bist ein Experte für Website-Analyse. Extrahiere strukturierte Informationen aus Website-Inhalten.
Antworte NUR mit gültigem JSON ohne Markdown-Formatierung.`;

    const userPrompt = `Analysiere diese Website und extrahiere folgende Informationen:

URL: ${formattedUrl}
Titel: ${title || 'Unbekannt'}

Website-Inhalt:
${websiteContent.substring(0, 12000)}

---

Extrahiere und generiere:
1. projectName: Der offizielle Firmen-/Projektname (aus dem Titel oder Inhalt)
2. description: Eine kurze Beschreibung was das Projekt/Unternehmen macht (2-3 Sätze)
3. goals: Mögliche Business-Ziele basierend auf dem Inhalt (z.B. "Lead-Generierung, SEO, Kundenbindung")
4. targetAudience: Die wahrscheinliche Zielgruppe basierend auf dem Inhalt
5. competitors: Liste von 2-3 möglichen Konkurrenten-Domains basierend auf der Branche

Antwort als reines JSON (kein Markdown, keine Erklärung):
{"projectName":"...","description":"...","goals":"...","targetAudience":"...","competitors":["domain1.com","domain2.com"]}`;

    console.log('Calling Lovable AI for extraction...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit erreicht. Bitte versuche es in einer Minute erneut.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI-Guthaben aufgebraucht. Bitte Credits aufladen.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Keine Antwort von der KI erhalten');
    }

    console.log('AI response:', content);

    // Parse the JSON response
    let extractedData;
    try {
      // Clean up potential markdown formatting
      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      extractedData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Try to extract with regex as fallback
      const projectNameMatch = content.match(/"projectName"\s*:\s*"([^"]+)"/);
      const descriptionMatch = content.match(/"description"\s*:\s*"([^"]+)"/);
      const goalsMatch = content.match(/"goals"\s*:\s*"([^"]+)"/);
      const targetAudienceMatch = content.match(/"targetAudience"\s*:\s*"([^"]+)"/);
      
      extractedData = {
        projectName: projectNameMatch?.[1] || title || 'Unbekanntes Projekt',
        description: descriptionMatch?.[1] || '',
        goals: goalsMatch?.[1] || 'Lead-Generierung, SEO, UX-Optimierung',
        targetAudience: targetAudienceMatch?.[1] || '',
        competitors: []
      };
    }

    console.log('Extraction complete:', extractedData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: extractedData,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-extract-project-info:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unbekannter Fehler' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
