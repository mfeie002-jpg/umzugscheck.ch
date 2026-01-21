import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AddressChangeRequest {
  userId: string;
  leadId?: string;
  oldAddress: {
    street: string;
    postalCode: string;
    city: string;
    canton: string;
  };
  newAddress: {
    street: string;
    postalCode: string;
    city: string;
    canton: string;
  };
  moveDate: string;
  residents: Array<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    ahvNumber?: string;
    isMainPerson: boolean;
  }>;
  services: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, ...payload } = await req.json();

    switch (action) {
      case "submit_address_change": {
        const request = payload as AddressChangeRequest;
        
        // Create bureaucracy request record
        const { data: requestRecord, error: insertError } = await supabase
          .from("bureaucracy_requests")
          .insert({
            user_id: request.userId,
            lead_id: request.leadId,
            old_address: request.oldAddress,
            new_address: request.newAddress,
            move_date: request.moveDate,
            residents: request.residents,
            selected_services: request.services,
            status: "pending",
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Initialize service statuses
        const serviceRecords = request.services.map(serviceType => ({
          request_id: requestRecord.id,
          service_type: serviceType,
          status: "pending",
          created_at: new Date().toISOString()
        }));

        const { error: servicesError } = await supabase
          .from("bureaucracy_services")
          .insert(serviceRecords);

        if (servicesError) throw servicesError;

        // Simulate processing (in production, this would trigger actual API calls)
        // For now, we'll queue them for background processing
        const { error: queueError } = await supabase
          .from("bureaucracy_queue")
          .insert({
            request_id: requestRecord.id,
            status: "queued",
            priority: 1,
            created_at: new Date().toISOString()
          });

        if (queueError) console.error("Queue error:", queueError);

        // Calculate fees
        const platformFee = 49;
        const additionalServiceFee = Math.max(0, request.services.length - 3) * 5;
        const totalFee = platformFee + additionalServiceFee;

        // Log event
        await supabase.from("bureaucracy_events").insert({
          request_id: requestRecord.id,
          event_type: "submitted",
          message: `Antrag eingereicht mit ${request.services.length} Services`,
          metadata: { services: request.services, fee: totalFee }
        });

        return new Response(
          JSON.stringify({
            success: true,
            requestId: requestRecord.id,
            estimatedDays: 7,
            totalFee,
            message: "Antrag erfolgreich eingereicht"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_status": {
        const { requestId } = payload;

        const { data: request, error: requestError } = await supabase
          .from("bureaucracy_requests")
          .select("*")
          .eq("id", requestId)
          .single();

        if (requestError) throw requestError;

        const { data: services, error: servicesError } = await supabase
          .from("bureaucracy_services")
          .select("*")
          .eq("request_id", requestId);

        if (servicesError) throw servicesError;

        const { data: events, error: eventsError } = await supabase
          .from("bureaucracy_events")
          .select("*")
          .eq("request_id", requestId)
          .order("created_at", { ascending: false });

        if (eventsError) throw eventsError;

        const completedCount = services?.filter(s => s.status === "completed").length || 0;
        const totalCount = services?.length || 0;

        return new Response(
          JSON.stringify({
            success: true,
            request,
            services,
            events,
            progress: {
              completed: completedCount,
              total: totalCount,
              percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
            }
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "process_service": {
        // Background processor for individual services
        const { requestId, serviceType } = payload;

        // Update service status to processing
        await supabase
          .from("bureaucracy_services")
          .update({ status: "processing", updated_at: new Date().toISOString() })
          .eq("request_id", requestId)
          .eq("service_type", serviceType);

        // Simulate API call to government/utility provider
        // In production, this would make actual API calls
        const success = Math.random() > 0.05; // 95% success rate simulation

        if (success) {
          const referenceNumber = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          await supabase
            .from("bureaucracy_services")
            .update({
              status: "completed",
              reference_number: referenceNumber,
              completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq("request_id", requestId)
            .eq("service_type", serviceType);

          await supabase.from("bureaucracy_events").insert({
            request_id: requestId,
            event_type: "completed",
            service_type: serviceType,
            message: `${serviceType} erfolgreich abgeschlossen`,
            metadata: { referenceNumber }
          });
        } else {
          await supabase
            .from("bureaucracy_services")
            .update({
              status: "failed",
              error_message: "Temporärer Fehler - wird automatisch erneut versucht",
              updated_at: new Date().toISOString()
            })
            .eq("request_id", requestId)
            .eq("service_type", serviceType);

          await supabase.from("bureaucracy_events").insert({
            request_id: requestId,
            event_type: "failed",
            service_type: serviceType,
            message: `${serviceType} fehlgeschlagen - erneuter Versuch geplant`
          });
        }

        // Check if all services are complete
        const { data: allServices } = await supabase
          .from("bureaucracy_services")
          .select("status")
          .eq("request_id", requestId);

        const allComplete = allServices?.every(s => 
          s.status === "completed" || s.status === "failed"
        );

        if (allComplete) {
          const hasFailures = allServices?.some(s => s.status === "failed");
          await supabase
            .from("bureaucracy_requests")
            .update({
              status: hasFailures ? "partially_completed" : "completed",
              completed_at: new Date().toISOString()
            })
            .eq("id", requestId);
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "track_affiliate": {
        // Track affiliate revenue from utility switches
        const { requestId, serviceType, provider, commissionCHF } = payload;

        await supabase.from("affiliate_tracking").insert({
          request_id: requestId,
          service_type: serviceType,
          provider,
          commission_chf: commissionCHF,
          status: "pending",
          created_at: new Date().toISOString()
        });

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Unknown action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error: unknown) {
    console.error("Behörden-API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
