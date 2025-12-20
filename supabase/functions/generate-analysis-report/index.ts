import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

const ANALYSIS_PROMPT = `Du bist ein Website-Analyse-Experte. Analysiere die folgende Website-URL und erstelle einen detaillierten technischen Bericht.

Website URL: {URL}

Erstelle eine JSON-Analyse mit folgendem exakten Format. Sei REALISTISCH und KRITISCH - die meisten Websites haben viele Probleme:

{
  "site_name": "Domain-Name der Website",
  "overall_score": [Zahl zwischen 25-75 - sei kritisch!],
  "monthly_loss": [geschätzter monatlicher Verlust in CHF wegen der Probleme, 1000-25000],
  "total_hours": [geschätzte Stunden für DIY-Behebung aller Probleme, 200-1500],
  "current_revenue": [geschätzter monatlicher Umsatz basierend auf Website-Typ, 5000-100000],
  "projected_revenue": [geschätzter Umsatz nach Optimierung, 30-80% höher als current],
  "categories": [
    {
      "name": "SEO & Sichtbarkeit",
      "score": [0-100],
      "icon": "Search",
      "issues": [
        {
          "title": "Konkretes Problem",
          "description": "Detaillierte technische Beschreibung warum das ein Problem ist",
          "severity": "critical",
          "hoursToFix": [1-40],
          "costIfIgnored": [100-3000]
        }
      ]
    },
    {
      "name": "Performance & Ladezeit",
      "score": [0-100],
      "icon": "Zap",
      "issues": [...]
    },
    {
      "name": "Mobile Optimierung",
      "score": [0-100],
      "icon": "Smartphone",
      "issues": [...]
    },
    {
      "name": "Sicherheit & SSL",
      "score": [0-100],
      "icon": "Shield",
      "issues": [...]
    },
    {
      "name": "Content & Struktur",
      "score": [0-100],
      "icon": "FileText",
      "issues": [...]
    },
    {
      "name": "Technische SEO",
      "score": [0-100],
      "icon": "Code",
      "issues": [...]
    },
    {
      "name": "User Experience",
      "score": [0-100],
      "icon": "Users",
      "issues": [...]
    },
    {
      "name": "Conversion-Optimierung",
      "score": [0-100],
      "icon": "Target",
      "issues": [...]
    }
  ],
  "consequences": [
    {
      "icon": "TrendingDown",
      "title": "Umsatzverlust",
      "description": "Konkrete Beschreibung des finanziellen Impacts"
    },
    {
      "icon": "UserMinus",
      "title": "Kundenverlust",
      "description": "Warum Kunden abspringen"
    },
    {
      "icon": "AlertTriangle",
      "title": "Wettbewerbsnachteil",
      "description": "Wie Konkurrenten profitieren"
    }
  ]
}

WICHTIG:
- Jede Kategorie MUSS 3-6 konkrete Issues haben
- Severity-Verteilung: ca. 25% critical, 40% warning, 35% info
- Bei "critical" Issues: hohe costIfIgnored (500-3000 CHF/Monat)
- Sei spezifisch und technisch korrekt
- Icons: Search, Zap, Smartphone, Shield, FileText, Code, Users, Target, MapPin, BarChart3, TrendingDown, UserMinus, DollarSign, AlertTriangle

Antworte NUR mit dem JSON, ohne zusätzlichen Text.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteUrl, leadId } = await req.json();

    if (!websiteUrl) {
      return new Response(
        JSON.stringify({ error: 'Website URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating analysis report for:', websiteUrl);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Call Lovable AI to analyze the website
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: ANALYSIS_PROMPT.replace('{URL}', websiteUrl)
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No content received from AI');
    }

    console.log('AI response received, parsing...');

    // Parse the JSON from AI response
    let analysisData;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      analysisData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('AI content:', aiContent.substring(0, 500));
      throw new Error('Failed to parse AI analysis');
    }

    // Calculate totals from the analysis
    let totalIssues = 0;
    let criticalIssues = 0;
    let warningIssues = 0;
    let infoIssues = 0;

    for (const category of analysisData.categories || []) {
      for (const issue of category.issues || []) {
        totalIssues++;
        if (issue.severity === 'critical') criticalIssues++;
        else if (issue.severity === 'warning') warningIssues++;
        else infoIssues++;
      }
    }

    // Generate unique token
    const token = generateToken();

    // Connect to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract domain name
    let siteName = analysisData.site_name;
    if (!siteName) {
      try {
        siteName = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`).hostname;
      } catch {
        siteName = websiteUrl;
      }
    }

    // Insert the report
    const reportData = {
      token,
      lead_id: leadId || null,
      website_url: websiteUrl,
      site_name: siteName,
      overall_score: Math.min(100, Math.max(0, analysisData.overall_score || 50)),
      total_issues: totalIssues,
      critical_issues: criticalIssues,
      warning_issues: warningIssues,
      info_issues: infoIssues,
      total_hours: analysisData.total_hours || 500,
      hourly_rate: 150,
      monthly_loss: analysisData.monthly_loss || 5000,
      current_revenue: analysisData.current_revenue || 20000,
      projected_revenue: analysisData.projected_revenue || 35000,
      categories: analysisData.categories || [],
      consequences: analysisData.consequences || [],
      status: 'completed',
    };

    const { data: report, error: insertError } = await supabase
      .from('analysis_reports')
      .insert(reportData)
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to save report');
    }

    console.log('Report saved successfully with token:', token);

    return new Response(
      JSON.stringify({ 
        success: true, 
        token,
        reportUrl: `/analyse/${token}`,
        report: {
          id: report.id,
          site_name: report.site_name,
          overall_score: report.overall_score,
          total_issues: report.total_issues,
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
