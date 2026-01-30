import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SurveySubmission {
  leadId?: string;
  fromCanton: string;
  toCanton: string;
  overallSatisfaction: number;
  stressLevel: number;
  planningEase?: number;
  movingCompanySatisfaction?: number;
  adminEase?: number;
  neighborsWelcome?: number;
  hadDamage?: boolean;
  moveType?: "professional" | "self" | "mixed";
  householdType?: "single" | "couple" | "family" | "shared";
  whatWentWell?: string;
  whatCouldImprove?: string;
}

// Swiss canton codes for validation
const VALID_CANTONS = [
  "ZH", "BE", "LU", "UR", "SZ", "OW", "NW", "GL", "ZG", "FR",
  "SO", "BS", "BL", "SH", "AR", "AI", "SG", "GR", "AG", "TG",
  "TI", "VD", "VS", "NE", "GE", "JU"
];

function validateSurvey(data: SurveySubmission): string | null {
  if (!data.fromCanton || !VALID_CANTONS.includes(data.fromCanton.toUpperCase())) {
    return "Invalid fromCanton. Must be a valid Swiss canton code.";
  }
  if (!data.toCanton || !VALID_CANTONS.includes(data.toCanton.toUpperCase())) {
    return "Invalid toCanton. Must be a valid Swiss canton code.";
  }
  if (!data.overallSatisfaction || data.overallSatisfaction < 1 || data.overallSatisfaction > 5) {
    return "overallSatisfaction must be between 1 and 5.";
  }
  if (!data.stressLevel || data.stressLevel < 1 || data.stressLevel > 5) {
    return "stressLevel must be between 1 and 5.";
  }
  // Validate optional ratings
  const optionalRatings = [
    data.planningEase,
    data.movingCompanySatisfaction,
    data.adminEase,
    data.neighborsWelcome,
  ];
  for (const rating of optionalRatings) {
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return "All ratings must be between 1 and 5.";
    }
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const data: SurveySubmission = await req.json();

    // Validate input
    const validationError = validateSurvey(data);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert survey
    const { data: survey, error: insertError } = await supabase
      .from("post_move_surveys")
      .insert({
        lead_id: data.leadId || null,
        from_canton: data.fromCanton.toUpperCase(),
        to_canton: data.toCanton.toUpperCase(),
        overall_satisfaction: data.overallSatisfaction,
        stress_level: data.stressLevel,
        planning_ease: data.planningEase,
        moving_company_satisfaction: data.movingCompanySatisfaction,
        admin_ease: data.adminEase,
        neighbors_welcome: data.neighborsWelcome,
        had_damage: data.hadDamage ?? false,
        move_type: data.moveType,
        household_type: data.householdType,
        what_went_well: data.whatWentWell?.substring(0, 1000),
        what_could_improve: data.whatCouldImprove?.substring(0, 1000),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting survey:", insertError);
      throw insertError;
    }

    // Trigger aggregation for both cantons
    await aggregateCantonHealth(supabase, data.fromCanton.toUpperCase());
    if (data.fromCanton.toUpperCase() !== data.toCanton.toUpperCase()) {
      await aggregateCantonHealth(supabase, data.toCanton.toUpperCase());
    }

    console.log(`Survey submitted: ${survey.id} (${data.fromCanton} → ${data.toCanton})`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        surveyId: survey.id,
        message: "Vielen Dank für Ihr Feedback!" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in submit-post-move-survey:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function aggregateCantonHealth(supabase: any, cantonCode: string) {
  // Get all surveys involving this canton (as origin or destination)
  const { data: surveys, error } = await supabase
    .from("post_move_surveys")
    .select("*")
    .or(`from_canton.eq.${cantonCode},to_canton.eq.${cantonCode}`)
    .gte("submitted_at", new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()); // Last year

  if (error || !surveys || surveys.length < 3) {
    // Not enough data to aggregate (privacy: need at least 3 responses)
    return;
  }

  const n = surveys.length;

  // Calculate averages (convert 1-5 scale to 0-100)
  const scaleToPercent = (val: number) => ((val - 1) / 4) * 100;
  const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const satisfactionScores = surveys.map((s: any) => scaleToPercent(s.overall_satisfaction));
  const stressScores = surveys.map((s: any) => scaleToPercent(6 - s.stress_level)); // Invert: low stress = high score
  const planningScores = surveys.filter((s: any) => s.planning_ease).map((s: any) => scaleToPercent(s.planning_ease));
  const companyScores = surveys.filter((s: any) => s.moving_company_satisfaction).map((s: any) => scaleToPercent(s.moving_company_satisfaction));
  const adminScores = surveys.filter((s: any) => s.admin_ease).map((s: any) => scaleToPercent(s.admin_ease));
  const welcomeScores = surveys.filter((s: any) => s.neighbors_welcome).map((s: any) => scaleToPercent(s.neighbors_welcome));

  const damageCount = surveys.filter((s: any) => s.had_damage).length;

  // Overall health = weighted average
  const overallHealth = (
    avg(satisfactionScores) * 0.3 +
    avg(stressScores) * 0.3 +
    (planningScores.length > 0 ? avg(planningScores) * 0.1 : 0) +
    (companyScores.length > 0 ? avg(companyScores) * 0.1 : 0) +
    (adminScores.length > 0 ? avg(adminScores) * 0.1 : 0) +
    (welcomeScores.length > 0 ? avg(welcomeScores) * 0.1 : 0)
  );

  // Calculate trend (compare last 3 months vs previous 3 months)
  const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
  
  const recentSurveys = surveys.filter((s: any) => new Date(s.submitted_at) >= threeMonthsAgo);
  const olderSurveys = surveys.filter((s: any) => {
    const date = new Date(s.submitted_at);
    return date >= sixMonthsAgo && date < threeMonthsAgo;
  });

  let trend: "improving" | "stable" | "declining" = "stable";
  if (recentSurveys.length >= 3 && olderSurveys.length >= 3) {
    const recentAvg = avg(recentSurveys.map((s: any) => s.overall_satisfaction));
    const olderAvg = avg(olderSurveys.map((s: any) => s.overall_satisfaction));
    const diff = recentAvg - olderAvg;
    if (diff > 0.3) trend = "improving";
    else if (diff < -0.3) trend = "declining";
  }

  // Update the move_health_index
  await supabase
    .from("move_health_index")
    .update({
      overall_health_score: Math.round(overallHealth * 10) / 10,
      satisfaction_index: Math.round(avg(satisfactionScores) * 10) / 10,
      stress_index: Math.round(avg(stressScores) * 10) / 10,
      planning_score: planningScores.length > 0 ? Math.round(avg(planningScores) * 10) / 10 : null,
      company_score: companyScores.length > 0 ? Math.round(avg(companyScores) * 10) / 10 : null,
      admin_score: adminScores.length > 0 ? Math.round(avg(adminScores) * 10) / 10 : null,
      welcome_score: welcomeScores.length > 0 ? Math.round(avg(welcomeScores) * 10) / 10 : null,
      total_responses: n,
      damage_rate_percent: Math.round((damageCount / n) * 1000) / 10,
      trend_vs_last_quarter: trend,
      last_calculated: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("canton_code", cantonCode);

  console.log(`Aggregated health index for ${cantonCode}: ${Math.round(overallHealth)}% (${n} responses)`);
}
