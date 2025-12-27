export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ab_tests: {
        Row: {
          created_by: string | null
          description: string | null
          ended_at: string | null
          id: string
          name: string
          started_at: string | null
          status: string
          variant_a_config: Json
          variant_a_conversions: number | null
          variant_a_impressions: number | null
          variant_b_config: Json
          variant_b_conversions: number | null
          variant_b_impressions: number | null
        }
        Insert: {
          created_by?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          name: string
          started_at?: string | null
          status?: string
          variant_a_config: Json
          variant_a_conversions?: number | null
          variant_a_impressions?: number | null
          variant_b_config: Json
          variant_b_conversions?: number | null
          variant_b_impressions?: number | null
        }
        Update: {
          created_by?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          name?: string
          started_at?: string | null
          status?: string
          variant_a_config?: Json
          variant_a_conversions?: number | null
          variant_a_impressions?: number | null
          variant_b_config?: Json
          variant_b_conversions?: number | null
          variant_b_impressions?: number | null
        }
        Relationships: []
      }
      analysis_reports: {
        Row: {
          categories: Json
          consequences: Json
          created_at: string
          critical_issues: number
          current_revenue: number
          hourly_rate: number
          id: string
          info_issues: number
          lead_id: string | null
          monthly_loss: number
          overall_score: number
          projected_revenue: number
          site_name: string
          status: string
          token: string
          total_hours: number
          total_issues: number
          updated_at: string
          viewed_at: string | null
          warning_issues: number
          website_url: string
        }
        Insert: {
          categories?: Json
          consequences?: Json
          created_at?: string
          critical_issues?: number
          current_revenue?: number
          hourly_rate?: number
          id?: string
          info_issues?: number
          lead_id?: string | null
          monthly_loss?: number
          overall_score?: number
          projected_revenue?: number
          site_name: string
          status?: string
          token: string
          total_hours?: number
          total_issues?: number
          updated_at?: string
          viewed_at?: string | null
          warning_issues?: number
          website_url: string
        }
        Update: {
          categories?: Json
          consequences?: Json
          created_at?: string
          critical_issues?: number
          current_revenue?: number
          hourly_rate?: number
          id?: string
          info_issues?: number
          lead_id?: string | null
          monthly_loss?: number
          overall_score?: number
          projected_revenue?: number
          site_name?: string
          status?: string
          token?: string
          total_hours?: number
          total_issues?: number
          updated_at?: string
          viewed_at?: string | null
          warning_issues?: number
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_reports_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_records: {
        Row: {
          billing_model: string
          billing_period: string | null
          created_at: string | null
          id: string
          invoice_number: string | null
          lead_id: string | null
          paid_at: string | null
          price_chf: number
          provider_id: string
          status: string | null
        }
        Insert: {
          billing_model: string
          billing_period?: string | null
          created_at?: string | null
          id?: string
          invoice_number?: string | null
          lead_id?: string | null
          paid_at?: string | null
          price_chf: number
          provider_id: string
          status?: string | null
        }
        Update: {
          billing_model?: string
          billing_period?: string | null
          created_at?: string | null
          id?: string
          invoice_number?: string | null
          lead_id?: string | null
          paid_at?: string | null
          price_chf?: number
          provider_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_records_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_records_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_records_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      bundled_estimates: {
        Row: {
          created_at: string | null
          estimate_session_ids: string[]
          expires_at: string | null
          id: string
          total_price_max: number
          total_price_min: number
        }
        Insert: {
          created_at?: string | null
          estimate_session_ids: string[]
          expires_at?: string | null
          id?: string
          total_price_max: number
          total_price_min: number
        }
        Update: {
          created_at?: string | null
          estimate_session_ids?: string[]
          expires_at?: string | null
          id?: string
          total_price_max?: number
          total_price_min?: number
        }
        Relationships: []
      }
      call_tracking: {
        Row: {
          call_duration: number | null
          caller_phone: string | null
          company_id: string
          created_at: string | null
          id: string
          timestamp: string
          was_successful: boolean | null
        }
        Insert: {
          call_duration?: number | null
          caller_phone?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          timestamp?: string
          was_successful?: boolean | null
        }
        Update: {
          call_duration?: number | null
          caller_phone?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          timestamp?: string
          was_successful?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "call_tracking_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_tracking_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          description: string | null
          email: string | null
          featured: boolean | null
          gallery_images: string[] | null
          id: string
          logo: string | null
          name: string
          phone: string | null
          price_level: string | null
          rating: number | null
          review_count: number | null
          service_areas: string[] | null
          service_types: string[] | null
          services: string[] | null
          updated_at: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          email?: string | null
          featured?: boolean | null
          gallery_images?: string[] | null
          id?: string
          logo?: string | null
          name: string
          phone?: string | null
          price_level?: string | null
          rating?: number | null
          review_count?: number | null
          service_areas?: string[] | null
          service_types?: string[] | null
          services?: string[] | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          email?: string | null
          featured?: boolean | null
          gallery_images?: string[] | null
          id?: string
          logo?: string | null
          name?: string
          phone?: string | null
          price_level?: string | null
          rating?: number | null
          review_count?: number | null
          service_areas?: string[] | null
          service_types?: string[] | null
          services?: string[] | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      conversion_analytics: {
        Row: {
          city: string
          company_id: string | null
          conversion_type: string
          created_at: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          service: string
          source_page: string | null
        }
        Insert: {
          city: string
          company_id?: string | null
          conversion_type: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          service: string
          source_page?: string | null
        }
        Update: {
          city?: string
          company_id?: string | null
          conversion_type?: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          service?: string
          source_page?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversion_analytics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversion_analytics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversion_analytics_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_flow_configs: {
        Row: {
          color: string
          created_at: string
          description: string | null
          flow_id: string
          id: string
          is_active: boolean
          label: string
          path: string
          steps: Json
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          flow_id: string
          id?: string
          is_active?: boolean
          label: string
          path: string
          steps?: Json
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          flow_id?: string
          id?: string
          is_active?: boolean
          label?: string
          path?: string
          steps?: Json
          updated_at?: string
        }
        Relationships: []
      }
      email_automation_settings: {
        Row: {
          alert_type: string
          created_at: string | null
          enabled: boolean | null
          frequency: string | null
          id: string
          last_sent_at: string | null
          threshold_value: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          enabled?: boolean | null
          frequency?: string | null
          id?: string
          last_sent_at?: string | null
          threshold_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          enabled?: boolean | null
          frequency?: string | null
          id?: string
          last_sent_at?: string | null
          threshold_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          body_template: string
          campaign_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          sent_count: number | null
          subject: string
          trigger_delay_hours: number | null
          trigger_event: string
        }
        Insert: {
          body_template: string
          campaign_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sent_count?: number | null
          subject: string
          trigger_delay_hours?: number | null
          trigger_event: string
        }
        Update: {
          body_template?: string
          campaign_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sent_count?: number | null
          subject?: string
          trigger_delay_hours?: number | null
          trigger_event?: string
        }
        Relationships: []
      }
      email_queue: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          recipient_email: string
          recipient_name: string | null
          scheduled_for: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          recipient_email: string
          recipient_name?: string | null
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          recipient_name?: string | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_queue_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_queue_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      estimate_sessions: {
        Row: {
          created_at: string | null
          estimate: Json
          expires_at: string | null
          funnel_variant: string | null
          id: string
          matching_company_ids: string[] | null
          move_details: Json
          selected_companies: number | null
          submitted_lead: boolean | null
          viewed_companies: boolean | null
        }
        Insert: {
          created_at?: string | null
          estimate: Json
          expires_at?: string | null
          funnel_variant?: string | null
          id?: string
          matching_company_ids?: string[] | null
          move_details: Json
          selected_companies?: number | null
          submitted_lead?: boolean | null
          viewed_companies?: boolean | null
        }
        Update: {
          created_at?: string | null
          estimate?: Json
          expires_at?: string | null
          funnel_variant?: string | null
          id?: string
          matching_company_ids?: string[] | null
          move_details?: Json
          selected_companies?: number | null
          submitted_lead?: boolean | null
          viewed_companies?: boolean | null
        }
        Relationships: []
      }
      export_jobs: {
        Row: {
          completed_at: string | null
          config: Json | null
          created_at: string
          created_by: string | null
          download_url: string | null
          error_message: string | null
          file_size_bytes: number | null
          id: string
          include_sub_variants: boolean | null
          job_type: string
          progress: number | null
          progress_message: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string
          created_by?: string | null
          download_url?: string | null
          error_message?: string | null
          file_size_bytes?: number | null
          id?: string
          include_sub_variants?: boolean | null
          job_type?: string
          progress?: number | null
          progress_message?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string
          created_by?: string | null
          download_url?: string | null
          error_message?: string | null
          file_size_bytes?: number | null
          id?: string
          include_sub_variants?: boolean | null
          job_type?: string
          progress?: number | null
          progress_message?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      flow_alert_settings: {
        Row: {
          alert_type: string
          created_at: string
          email: string
          flow_id: string | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          threshold_value: number | null
          updated_at: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          email: string
          flow_id?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          threshold_value?: number | null
          updated_at?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          email?: string
          flow_id?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          threshold_value?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      flow_alerts: {
        Row: {
          acknowledged_at: string | null
          alert_type: string
          created_at: string
          flow_id: string | null
          id: string
          is_acknowledged: boolean | null
          message: string | null
          metadata: Json | null
          setting_id: string | null
          severity: string
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          alert_type: string
          created_at?: string
          flow_id?: string | null
          id?: string
          is_acknowledged?: boolean | null
          message?: string | null
          metadata?: Json | null
          setting_id?: string | null
          severity?: string
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          alert_type?: string
          created_at?: string
          flow_id?: string | null
          id?: string
          is_acknowledged?: boolean | null
          message?: string | null
          metadata?: Json | null
          setting_id?: string | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "flow_alerts_setting_id_fkey"
            columns: ["setting_id"]
            isOneToOne: false
            referencedRelation: "flow_alert_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_analysis_runs: {
        Row: {
          accessibility_score: number | null
          ai_recommendations: Json | null
          ai_summary: string | null
          completed_at: string | null
          conversion_score: number | null
          created_at: string
          flow_id: string
          flow_name: string
          id: string
          metadata: Json | null
          overall_score: number | null
          performance_score: number | null
          run_type: string
          started_at: string | null
          status: string
          steps_captured: number | null
          total_steps: number | null
          ux_score: number | null
        }
        Insert: {
          accessibility_score?: number | null
          ai_recommendations?: Json | null
          ai_summary?: string | null
          completed_at?: string | null
          conversion_score?: number | null
          created_at?: string
          flow_id: string
          flow_name: string
          id?: string
          metadata?: Json | null
          overall_score?: number | null
          performance_score?: number | null
          run_type?: string
          started_at?: string | null
          status?: string
          steps_captured?: number | null
          total_steps?: number | null
          ux_score?: number | null
        }
        Update: {
          accessibility_score?: number | null
          ai_recommendations?: Json | null
          ai_summary?: string | null
          completed_at?: string | null
          conversion_score?: number | null
          created_at?: string
          flow_id?: string
          flow_name?: string
          id?: string
          metadata?: Json | null
          overall_score?: number | null
          performance_score?: number | null
          run_type?: string
          started_at?: string | null
          status?: string
          steps_captured?: number | null
          total_steps?: number | null
          ux_score?: number | null
        }
        Relationships: []
      }
      flow_feedback_variants: {
        Row: {
          created_at: string
          error_message: string | null
          executed_at: string | null
          flow_id: string
          id: string
          output_flow_id: string | null
          prompt: string
          result_json: Json | null
          status: string
          updated_at: string
          variant_label: string
          variant_name: string
          zip_url: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          executed_at?: string | null
          flow_id: string
          id?: string
          output_flow_id?: string | null
          prompt: string
          result_json?: Json | null
          status?: string
          updated_at?: string
          variant_label: string
          variant_name: string
          zip_url?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          executed_at?: string | null
          flow_id?: string
          id?: string
          output_flow_id?: string | null
          prompt?: string
          result_json?: Json | null
          status?: string
          updated_at?: string
          variant_label?: string
          variant_name?: string
          zip_url?: string | null
        }
        Relationships: []
      }
      flow_scheduled_jobs: {
        Row: {
          created_at: string
          flow_ids: string[]
          id: string
          is_active: boolean | null
          last_run_at: string | null
          name: string
          next_run_at: string | null
          notify_email: string | null
          schedule: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          flow_ids: string[]
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          name: string
          next_run_at?: string | null
          notify_email?: string | null
          schedule: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          flow_ids?: string[]
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          name?: string
          next_run_at?: string | null
          notify_email?: string | null
          schedule?: string
          updated_at?: string
        }
        Relationships: []
      }
      flow_step_metrics: {
        Row: {
          ai_issues: Json | null
          ai_suggestions: Json | null
          contrast_issues: number | null
          created_at: string
          cumulative_layout_shift: number | null
          desktop_screenshot_url: string | null
          estimated_completion_rate: number | null
          estimated_drop_off_rate: number | null
          first_contentful_paint_ms: number | null
          flow_id: string
          form_fields_count: number | null
          id: string
          largest_contentful_paint_ms: number | null
          load_time_ms: number | null
          mobile_friendliness_score: number | null
          mobile_screenshot_url: string | null
          required_fields_count: number | null
          run_id: string | null
          step_name: string | null
          step_number: number
          step_url: string | null
          time_to_interactive_ms: number | null
          touch_target_issues: number | null
        }
        Insert: {
          ai_issues?: Json | null
          ai_suggestions?: Json | null
          contrast_issues?: number | null
          created_at?: string
          cumulative_layout_shift?: number | null
          desktop_screenshot_url?: string | null
          estimated_completion_rate?: number | null
          estimated_drop_off_rate?: number | null
          first_contentful_paint_ms?: number | null
          flow_id: string
          form_fields_count?: number | null
          id?: string
          largest_contentful_paint_ms?: number | null
          load_time_ms?: number | null
          mobile_friendliness_score?: number | null
          mobile_screenshot_url?: string | null
          required_fields_count?: number | null
          run_id?: string | null
          step_name?: string | null
          step_number: number
          step_url?: string | null
          time_to_interactive_ms?: number | null
          touch_target_issues?: number | null
        }
        Update: {
          ai_issues?: Json | null
          ai_suggestions?: Json | null
          contrast_issues?: number | null
          created_at?: string
          cumulative_layout_shift?: number | null
          desktop_screenshot_url?: string | null
          estimated_completion_rate?: number | null
          estimated_drop_off_rate?: number | null
          first_contentful_paint_ms?: number | null
          flow_id?: string
          form_fields_count?: number | null
          id?: string
          largest_contentful_paint_ms?: number | null
          load_time_ms?: number | null
          mobile_friendliness_score?: number | null
          mobile_screenshot_url?: string | null
          required_fields_count?: number | null
          run_id?: string | null
          step_name?: string | null
          step_number?: number
          step_url?: string | null
          time_to_interactive_ms?: number | null
          touch_target_issues?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_step_metrics_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "flow_analysis_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_ux_issues: {
        Row: {
          affected_element: string | null
          category: string
          created_at: string
          description: string | null
          flow_id: string
          id: string
          is_resolved: boolean | null
          issue_type: string
          recommendation: string | null
          resolved_at: string | null
          run_id: string | null
          screenshot_url: string | null
          severity: string
          step_number: number | null
          title: string
        }
        Insert: {
          affected_element?: string | null
          category: string
          created_at?: string
          description?: string | null
          flow_id: string
          id?: string
          is_resolved?: boolean | null
          issue_type: string
          recommendation?: string | null
          resolved_at?: string | null
          run_id?: string | null
          screenshot_url?: string | null
          severity: string
          step_number?: number | null
          title: string
        }
        Update: {
          affected_element?: string | null
          category?: string
          created_at?: string
          description?: string | null
          flow_id?: string
          id?: string
          is_resolved?: boolean | null
          issue_type?: string
          recommendation?: string | null
          resolved_at?: string | null
          run_id?: string | null
          screenshot_url?: string | null
          severity?: string
          step_number?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "flow_ux_issues_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "flow_analysis_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_versions: {
        Row: {
          adjustment_number: number | null
          ai_feedback: string | null
          ai_feedback_date: string | null
          ai_feedback_source: string | null
          config: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          flow_code: string | null
          flow_id: string
          flow_number: number | null
          html_snapshots: Json
          id: string
          is_active: boolean | null
          is_baseline: boolean | null
          is_live: boolean | null
          is_ultimate: boolean | null
          parent_flow_code: string | null
          screenshots: Json
          step_configs: Json
          tags: string[] | null
          variant_letter: string | null
          version_name: string | null
          version_number: string
        }
        Insert: {
          adjustment_number?: number | null
          ai_feedback?: string | null
          ai_feedback_date?: string | null
          ai_feedback_source?: string | null
          config?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          flow_code?: string | null
          flow_id: string
          flow_number?: number | null
          html_snapshots?: Json
          id?: string
          is_active?: boolean | null
          is_baseline?: boolean | null
          is_live?: boolean | null
          is_ultimate?: boolean | null
          parent_flow_code?: string | null
          screenshots?: Json
          step_configs?: Json
          tags?: string[] | null
          variant_letter?: string | null
          version_name?: string | null
          version_number: string
        }
        Update: {
          adjustment_number?: number | null
          ai_feedback?: string | null
          ai_feedback_date?: string | null
          ai_feedback_source?: string | null
          config?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          flow_code?: string | null
          flow_id?: string
          flow_number?: number | null
          html_snapshots?: Json
          id?: string
          is_active?: boolean | null
          is_baseline?: boolean | null
          is_live?: boolean | null
          is_ultimate?: boolean | null
          parent_flow_code?: string | null
          screenshots?: Json
          step_configs?: Json
          tags?: string[] | null
          variant_letter?: string | null
          version_name?: string | null
          version_number?: string
        }
        Relationships: []
      }
      historical_pricing: {
        Row: {
          avg_price: number
          canton_code: string
          created_at: string
          id: string
          lead_volume: number
          max_price: number
          min_price: number
          month: string
          year: number
        }
        Insert: {
          avg_price: number
          canton_code: string
          created_at?: string
          id?: string
          lead_volume?: number
          max_price: number
          min_price: number
          month: string
          year: number
        }
        Update: {
          avg_price?: number
          canton_code?: string
          created_at?: string
          id?: string
          lead_volume?: number
          max_price?: number
          min_price?: number
          month?: string
          year?: number
        }
        Relationships: []
      }
      homepage_ab_config: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      homepage_ab_events: {
        Row: {
          created_at: string | null
          event_type: string
          flow_variant: string
          id: string
          metadata: Json | null
          page_path: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          flow_variant: string
          id?: string
          metadata?: Json | null
          page_path?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          flow_variant?: string
          id?: string
          metadata?: Json | null
          page_path?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      lead_bids: {
        Row: {
          bid_amount: number
          created_at: string
          id: string
          lead_id: string
          provider_id: string
          status: string
          updated_at: string
        }
        Insert: {
          bid_amount: number
          created_at?: string
          id?: string
          lead_id: string
          provider_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          bid_amount?: number
          created_at?: string
          id?: string
          lead_id?: string
          provider_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_bids_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_bids_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_bids_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_quality_factors: {
        Row: {
          completeness_score: number | null
          created_at: string | null
          historical_score: number | null
          id: string
          lead_id: string
          predicted_conversion_probability: number | null
          provider_fit_score: number | null
          quality_score: number
          recommended_price: number | null
          updated_at: string | null
          urgency_score: number | null
          value_score: number | null
        }
        Insert: {
          completeness_score?: number | null
          created_at?: string | null
          historical_score?: number | null
          id?: string
          lead_id: string
          predicted_conversion_probability?: number | null
          provider_fit_score?: number | null
          quality_score: number
          recommended_price?: number | null
          updated_at?: string | null
          urgency_score?: number | null
          value_score?: number | null
        }
        Update: {
          completeness_score?: number | null
          created_at?: string | null
          historical_score?: number | null
          id?: string
          lead_id?: string
          predicted_conversion_probability?: number | null
          provider_fit_score?: number | null
          quality_score?: number
          recommended_price?: number | null
          updated_at?: string | null
          urgency_score?: number | null
          value_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_quality_factors_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_transactions: {
        Row: {
          actual_job_value: number | null
          amount: number
          conversion_date: string | null
          conversion_notes: string | null
          conversion_status: string | null
          created_at: string | null
          currency: string | null
          id: string
          lead_id: string
          lost_reason: string | null
          provider_id: string
          purchased_at: string | null
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_job_value?: number | null
          amount: number
          conversion_date?: string | null
          conversion_notes?: string | null
          conversion_status?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          lead_id: string
          lost_reason?: string | null
          provider_id: string
          purchased_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_job_value?: number | null
          amount?: number
          conversion_date?: string | null
          conversion_notes?: string | null
          conversion_status?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          lead_id?: string
          lost_reason?: string | null
          provider_id?: string
          purchased_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_transactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_transactions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_transactions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_provider_ids: string[] | null
          bid_count: number | null
          bidding_closes_at: string | null
          bidding_enabled: boolean | null
          bundled_estimate_id: string | null
          calculator_input: Json
          calculator_output: Json
          calculator_type: string
          comments: string | null
          created_at: string | null
          current_highest_bid: number | null
          email: string
          estimate_session_id: string | null
          from_city: string
          from_postal: string
          id: string
          lead_source: string | null
          move_date: string | null
          name: string
          phone: string | null
          selected_company_ids: string[] | null
          starting_bid: number | null
          status: string | null
          to_city: string
          to_postal: string
        }
        Insert: {
          assigned_provider_ids?: string[] | null
          bid_count?: number | null
          bidding_closes_at?: string | null
          bidding_enabled?: boolean | null
          bundled_estimate_id?: string | null
          calculator_input: Json
          calculator_output: Json
          calculator_type: string
          comments?: string | null
          created_at?: string | null
          current_highest_bid?: number | null
          email: string
          estimate_session_id?: string | null
          from_city: string
          from_postal: string
          id?: string
          lead_source?: string | null
          move_date?: string | null
          name: string
          phone?: string | null
          selected_company_ids?: string[] | null
          starting_bid?: number | null
          status?: string | null
          to_city: string
          to_postal: string
        }
        Update: {
          assigned_provider_ids?: string[] | null
          bid_count?: number | null
          bidding_closes_at?: string | null
          bidding_enabled?: boolean | null
          bundled_estimate_id?: string | null
          calculator_input?: Json
          calculator_output?: Json
          calculator_type?: string
          comments?: string | null
          created_at?: string | null
          current_highest_bid?: number | null
          email?: string
          estimate_session_id?: string | null
          from_city?: string
          from_postal?: string
          id?: string
          lead_source?: string | null
          move_date?: string | null
          name?: string
          phone?: string | null
          selected_company_ids?: string[] | null
          starting_bid?: number | null
          status?: string | null
          to_city?: string
          to_postal?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_bundled_estimate_id_fkey"
            columns: ["bundled_estimate_id"]
            isOneToOne: false
            referencedRelation: "bundled_estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_estimate_session_id_fkey"
            columns: ["estimate_session_id"]
            isOneToOne: false
            referencedRelation: "estimate_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_bids: {
        Row: {
          available_date: string | null
          bid_amount: number
          created_at: string
          estimated_duration_hours: number | null
          id: string
          includes_services: string[]
          listing_id: string
          message: string | null
          provider_id: string
          status: string
          updated_at: string
          viewed_at: string | null
        }
        Insert: {
          available_date?: string | null
          bid_amount: number
          created_at?: string
          estimated_duration_hours?: number | null
          id?: string
          includes_services?: string[]
          listing_id: string
          message?: string | null
          provider_id: string
          status?: string
          updated_at?: string
          viewed_at?: string | null
        }
        Update: {
          available_date?: string | null
          bid_amount?: number
          created_at?: string
          estimated_duration_hours?: number | null
          id?: string
          includes_services?: string[]
          listing_id?: string
          message?: string | null
          provider_id?: string
          status?: string
          updated_at?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_bids_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "public_move_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_bids_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_bids_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_ranking_models: {
        Row: {
          accuracy_score: number | null
          created_at: string | null
          id: string
          last_trained_at: string | null
          model_name: string
          model_version: string
          recommendations: Json | null
          status: string
          training_data: Json
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string | null
          id?: string
          last_trained_at?: string | null
          model_name: string
          model_version: string
          recommendations?: Json | null
          status?: string
          training_data: Json
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string | null
          id?: string
          last_trained_at?: string | null
          model_name?: string
          model_version?: string
          recommendations?: Json | null
          status?: string
          training_data?: Json
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          source: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          payment_type: string
          provider_id: string
          status: string
          stripe_payment_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_type: string
          provider_id: string
          status?: string
          stripe_payment_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_type?: string
          provider_id?: string
          status?: string
          stripe_payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_analytics: {
        Row: {
          active_providers: number | null
          avg_lead_value: number | null
          avg_response_time_hours: number | null
          created_at: string | null
          customer_satisfaction_avg: number | null
          id: string
          metric_date: string
          new_providers: number | null
          total_conversions: number | null
          total_leads: number | null
          total_revenue: number | null
        }
        Insert: {
          active_providers?: number | null
          avg_lead_value?: number | null
          avg_response_time_hours?: number | null
          created_at?: string | null
          customer_satisfaction_avg?: number | null
          id?: string
          metric_date?: string
          new_providers?: number | null
          total_conversions?: number | null
          total_leads?: number | null
          total_revenue?: number | null
        }
        Update: {
          active_providers?: number | null
          avg_lead_value?: number | null
          avg_response_time_hours?: number | null
          created_at?: string | null
          customer_satisfaction_avg?: number | null
          id?: string
          metric_date?: string
          new_providers?: number | null
          total_conversions?: number | null
          total_leads?: number | null
          total_revenue?: number | null
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          alert_frequency: string
          canton_code: string
          created_at: string
          id: string
          is_active: boolean
          last_triggered_at: string | null
          max_price: number
          updated_at: string
          user_email: string
        }
        Insert: {
          alert_frequency?: string
          canton_code: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          max_price: number
          updated_at?: string
          user_email: string
        }
        Update: {
          alert_frequency?: string
          canton_code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          max_price?: number
          updated_at?: string
          user_email?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      provider_availability: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_available: boolean | null
          provider_id: string
          slots_available: number | null
          slots_booked: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_available?: boolean | null
          provider_id: string
          slots_available?: number | null
          slots_booked?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_available?: boolean | null
          provider_id?: string
          slots_available?: number | null
          slots_booked?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_availability_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_availability_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_click_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          price_chf: number
          provider_id: string
          referer: string | null
          user_agent: string | null
          user_ip: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          price_chf: number
          provider_id: string
          referer?: string | null
          user_agent?: string | null
          user_ip?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          price_chf?: number
          provider_id?: string
          referer?: string | null
          user_agent?: string | null
          user_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_click_events_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_click_events_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_performance_metrics: {
        Row: {
          conversion_rate: number | null
          created_at: string | null
          customer_satisfaction_score: number | null
          id: string
          leads_contacted: number | null
          leads_converted: number | null
          leads_received: number | null
          leads_viewed: number | null
          metric_date: string
          provider_id: string
          response_time_avg_hours: number | null
          updated_at: string | null
        }
        Insert: {
          conversion_rate?: number | null
          created_at?: string | null
          customer_satisfaction_score?: number | null
          id?: string
          leads_contacted?: number | null
          leads_converted?: number | null
          leads_received?: number | null
          leads_viewed?: number | null
          metric_date?: string
          provider_id: string
          response_time_avg_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          conversion_rate?: number | null
          created_at?: string | null
          customer_satisfaction_score?: number | null
          id?: string
          leads_contacted?: number | null
          leads_converted?: number | null
          leads_received?: number | null
          leads_viewed?: number | null
          metric_date?: string
          provider_id?: string
          response_time_avg_hours?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_performance_metrics_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_performance_metrics_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          plan_id: string
          provider_id: string
          start_date: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_id: string
          provider_id: string
          start_date?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_id?: string
          provider_id?: string
          start_date?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_subscriptions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_subscriptions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      public_move_listings: {
        Row: {
          apartment_size: string
          awarded_at: string | null
          bid_count: number | null
          budget_max: number | null
          budget_min: number | null
          created_at: string
          current_lowest_bid: number | null
          expires_at: string
          from_city: string
          from_postal: string
          id: string
          is_urgent: boolean | null
          lead_id: string | null
          move_date: string
          response_deadline: string | null
          services_requested: string[]
          starting_price: number | null
          status: string
          to_city: string
          to_postal: string
          updated_at: string
          view_count: number | null
          visibility: string
        }
        Insert: {
          apartment_size: string
          awarded_at?: string | null
          bid_count?: number | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          current_lowest_bid?: number | null
          expires_at?: string
          from_city: string
          from_postal: string
          id?: string
          is_urgent?: boolean | null
          lead_id?: string | null
          move_date: string
          response_deadline?: string | null
          services_requested?: string[]
          starting_price?: number | null
          status?: string
          to_city: string
          to_postal: string
          updated_at?: string
          view_count?: number | null
          visibility?: string
        }
        Update: {
          apartment_size?: string
          awarded_at?: string | null
          bid_count?: number | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          current_lowest_bid?: number | null
          expires_at?: string
          from_city?: string
          from_postal?: string
          id?: string
          is_urgent?: boolean | null
          lead_id?: string | null
          move_date?: string
          response_deadline?: string | null
          services_requested?: string[]
          starting_price?: number | null
          status?: string
          to_city?: string
          to_postal?: string
          updated_at?: string
          view_count?: number | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_move_listings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_benchmarks: {
        Row: {
          avg_conversion_rate: number | null
          avg_time_to_conversion: number | null
          configuration: Json
          created_by: string | null
          id: string
          notes: string | null
          revenue_generated: number | null
          snapshot_date: string
          total_conversions: number | null
          total_impressions: number | null
        }
        Insert: {
          avg_conversion_rate?: number | null
          avg_time_to_conversion?: number | null
          configuration: Json
          created_by?: string | null
          id?: string
          notes?: string | null
          revenue_generated?: number | null
          snapshot_date?: string
          total_conversions?: number | null
          total_impressions?: number | null
        }
        Update: {
          avg_conversion_rate?: number | null
          avg_time_to_conversion?: number | null
          configuration?: Json
          created_by?: string | null
          id?: string
          notes?: string | null
          revenue_generated?: number | null
          snapshot_date?: string
          total_conversions?: number | null
          total_impressions?: number | null
        }
        Relationships: []
      }
      ranking_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          company_id: string
          company_name: string
          id: string
          is_featured: boolean
          position: number
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          company_id: string
          company_name: string
          id?: string
          is_featured?: boolean
          position: number
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          company_id?: string
          company_name?: string
          id?: string
          is_featured?: boolean
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "ranking_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ranking_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          action_type: string
          attempt_count: number
          created_at: string | null
          id: string
          identifier: string
          window_start: string
        }
        Insert: {
          action_type: string
          attempt_count?: number
          created_at?: string | null
          id?: string
          identifier: string
          window_start?: string
        }
        Update: {
          action_type?: string
          attempt_count?: number
          created_at?: string | null
          id?: string
          identifier?: string
          window_start?: string
        }
        Relationships: []
      }
      realtime_ranking_metrics: {
        Row: {
          company_id: string | null
          id: string
          metadata: Json | null
          metric_type: string
          recorded_at: string | null
          value: number
        }
        Insert: {
          company_id?: string | null
          id?: string
          metadata?: Json | null
          metric_type: string
          recorded_at?: string | null
          value: number
        }
        Update: {
          company_id?: string | null
          id?: string
          metadata?: Json | null
          metric_type?: string
          recorded_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "realtime_ranking_metrics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "realtime_ranking_metrics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      regional_rankings: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          is_featured: boolean
          position: number
          region_code: string
          region_name: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          is_featured?: boolean
          position: number
          region_code: string
          region_name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          is_featured?: boolean
          position?: number
          region_code?: string
          region_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "regional_rankings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regional_rankings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      review_photos: {
        Row: {
          display_order: number | null
          id: string
          photo_url: string
          review_id: string | null
          uploaded_at: string | null
        }
        Insert: {
          display_order?: number | null
          id?: string
          photo_url: string
          review_id?: string | null
          uploaded_at?: string | null
        }
        Update: {
          display_order?: number | null
          id?: string
          photo_url?: string
          review_id?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_photos_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_requests: {
        Row: {
          created_at: string | null
          customer_email: string
          customer_name: string
          id: string
          lead_id: string
          provider_id: string
          reminder_sent_at: string | null
          request_sent_at: string | null
          review_id: string | null
          review_submitted: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email: string
          customer_name: string
          id?: string
          lead_id: string
          provider_id: string
          reminder_sent_at?: string | null
          request_sent_at?: string | null
          review_id?: string | null
          review_submitted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          id?: string
          lead_id?: string
          provider_id?: string
          reminder_sent_at?: string | null
          request_sent_at?: string | null
          review_id?: string | null
          review_submitted?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_requests_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_requests_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_responses: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          response: string
          review_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          response: string
          review_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          response?: string
          review_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_responses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_responses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_votes: {
        Row: {
          created_at: string | null
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string
          company_id: string
          created_at: string | null
          helpful_count: number | null
          id: string
          lead_id: string | null
          photos: string[] | null
          rating: number
          service_ratings: Json | null
          title: string
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          comment: string
          company_id: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          lead_id?: string | null
          photos?: string[] | null
          rating: number
          service_ratings?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          comment?: string
          company_id?: string
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          lead_id?: string | null
          photos?: string[] | null
          rating?: number
          service_ratings?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_rankings: {
        Row: {
          configuration: Json
          created_at: string | null
          created_by: string | null
          description: string
          executed_at: string | null
          id: string
          scheduled_date: string
          status: string
        }
        Insert: {
          configuration: Json
          created_at?: string | null
          created_by?: string | null
          description: string
          executed_at?: string | null
          id?: string
          scheduled_date: string
          status?: string
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string
          executed_at?: string | null
          id?: string
          scheduled_date?: string
          status?: string
        }
        Relationships: []
      }
      screenshot_alert_settings: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          threshold_percent: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          threshold_percent?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          threshold_percent?: number
          updated_at?: string
        }
        Relationships: []
      }
      screenshot_baselines: {
        Row: {
          created_at: string
          dimension: string
          id: string
          image_base64: string
          is_active: boolean
          last_checked_at: string | null
          name: string
          threshold_percent: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          dimension?: string
          id?: string
          image_base64: string
          is_active?: boolean
          last_checked_at?: string | null
          name: string
          threshold_percent?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          dimension?: string
          id?: string
          image_base64?: string
          is_active?: boolean
          last_checked_at?: string | null
          name?: string
          threshold_percent?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      screenshot_history: {
        Row: {
          created_at: string
          dimension: string
          id: string
          image_base64: string
          is_full_page: boolean
          metadata: Json | null
          url: string
        }
        Insert: {
          created_at?: string
          dimension: string
          id?: string
          image_base64: string
          is_full_page?: boolean
          metadata?: Json | null
          url: string
        }
        Update: {
          created_at?: string
          dimension?: string
          id?: string
          image_base64?: string
          is_full_page?: boolean
          metadata?: Json | null
          url?: string
        }
        Relationships: []
      }
      screenshot_regression_results: {
        Row: {
          baseline_id: string
          created_at: string
          diff_image_base64: string | null
          diff_percent: number
          id: string
          new_image_base64: string
          notes: string | null
          status: string
        }
        Insert: {
          baseline_id: string
          created_at?: string
          diff_image_base64?: string | null
          diff_percent: number
          id?: string
          new_image_base64: string
          notes?: string | null
          status?: string
        }
        Update: {
          baseline_id?: string
          created_at?: string
          diff_image_base64?: string | null
          diff_percent?: number
          id?: string
          new_image_base64?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "screenshot_regression_results_baseline_id_fkey"
            columns: ["baseline_id"]
            isOneToOne: false
            referencedRelation: "screenshot_baselines"
            referencedColumns: ["id"]
          },
        ]
      }
      seasonal_ranking_presets: {
        Row: {
          configuration: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          season: string
          updated_at: string | null
        }
        Insert: {
          configuration: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          season: string
          updated_at?: string | null
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          season?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_providers: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"]
          avg_completion_time_hours: number | null
          bidding_active: boolean | null
          billing_model: string | null
          booking_calendar_url: string | null
          call_price_chf: number | null
          call_tracking_enabled: boolean | null
          cantons_served: string[]
          certifications: string[] | null
          cities_served: string[] | null
          city: string
          click_price_chf: number | null
          company_name: string
          contact_person_name: string
          country: string
          cpc_enabled: boolean | null
          cpc_price_chf: number | null
          cpl_enabled: boolean | null
          cpl_price_chf: number | null
          created_at: string
          daily_budget_chf: number | null
          daily_budget_remaining_chf: number | null
          description: string | null
          discount_offer: string | null
          email: string
          employees_count: number | null
          featured_position: number | null
          fleet_size: number | null
          id: string
          is_featured: boolean | null
          lead_price_chf: number | null
          logo_url: string | null
          long_description: string | null
          max_bid_chf: number | null
          max_leads_per_month: number | null
          min_job_value: number | null
          monthly_fee_chf: number | null
          password_hash: string
          phone: string
          phone_tracking_number: string | null
          preferred_regions: string[] | null
          price_level: Database["public"]["Enums"]["price_level"] | null
          profile_completeness: number | null
          profile_gallery: string[] | null
          quality_score: number | null
          ranking_position: number | null
          response_time_minutes: number | null
          services_offered: string[]
          short_description: string | null
          slug: string | null
          sponsored_tier: number | null
          street: string
          subscription_plan: string | null
          success_rate: number | null
          team_members: Json | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          website: string | null
          working_hours: Json | null
          zip: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"]
          avg_completion_time_hours?: number | null
          bidding_active?: boolean | null
          billing_model?: string | null
          booking_calendar_url?: string | null
          call_price_chf?: number | null
          call_tracking_enabled?: boolean | null
          cantons_served?: string[]
          certifications?: string[] | null
          cities_served?: string[] | null
          city: string
          click_price_chf?: number | null
          company_name: string
          contact_person_name: string
          country?: string
          cpc_enabled?: boolean | null
          cpc_price_chf?: number | null
          cpl_enabled?: boolean | null
          cpl_price_chf?: number | null
          created_at?: string
          daily_budget_chf?: number | null
          daily_budget_remaining_chf?: number | null
          description?: string | null
          discount_offer?: string | null
          email: string
          employees_count?: number | null
          featured_position?: number | null
          fleet_size?: number | null
          id?: string
          is_featured?: boolean | null
          lead_price_chf?: number | null
          logo_url?: string | null
          long_description?: string | null
          max_bid_chf?: number | null
          max_leads_per_month?: number | null
          min_job_value?: number | null
          monthly_fee_chf?: number | null
          password_hash: string
          phone: string
          phone_tracking_number?: string | null
          preferred_regions?: string[] | null
          price_level?: Database["public"]["Enums"]["price_level"] | null
          profile_completeness?: number | null
          profile_gallery?: string[] | null
          quality_score?: number | null
          ranking_position?: number | null
          response_time_minutes?: number | null
          services_offered?: string[]
          short_description?: string | null
          slug?: string | null
          sponsored_tier?: number | null
          street: string
          subscription_plan?: string | null
          success_rate?: number | null
          team_members?: Json | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          website?: string | null
          working_hours?: Json | null
          zip: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"]
          avg_completion_time_hours?: number | null
          bidding_active?: boolean | null
          billing_model?: string | null
          booking_calendar_url?: string | null
          call_price_chf?: number | null
          call_tracking_enabled?: boolean | null
          cantons_served?: string[]
          certifications?: string[] | null
          cities_served?: string[] | null
          city?: string
          click_price_chf?: number | null
          company_name?: string
          contact_person_name?: string
          country?: string
          cpc_enabled?: boolean | null
          cpc_price_chf?: number | null
          cpl_enabled?: boolean | null
          cpl_price_chf?: number | null
          created_at?: string
          daily_budget_chf?: number | null
          daily_budget_remaining_chf?: number | null
          description?: string | null
          discount_offer?: string | null
          email?: string
          employees_count?: number | null
          featured_position?: number | null
          fleet_size?: number | null
          id?: string
          is_featured?: boolean | null
          lead_price_chf?: number | null
          logo_url?: string | null
          long_description?: string | null
          max_bid_chf?: number | null
          max_leads_per_month?: number | null
          min_job_value?: number | null
          monthly_fee_chf?: number | null
          password_hash?: string
          phone?: string
          phone_tracking_number?: string | null
          preferred_regions?: string[] | null
          price_level?: Database["public"]["Enums"]["price_level"] | null
          profile_completeness?: number | null
          profile_gallery?: string[] | null
          quality_score?: number | null
          ranking_position?: number | null
          response_time_minutes?: number | null
          services_offered?: string[]
          short_description?: string | null
          slug?: string | null
          sponsored_tier?: number | null
          street?: string
          subscription_plan?: string | null
          success_rate?: number | null
          team_members?: Json | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          website?: string | null
          working_hours?: Json | null
          zip?: string
        }
        Relationships: []
      }
      sponsored_plans: {
        Row: {
          company_id: string
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          monthly_price_chf: number
          region: string | null
          start_date: string
          tier: number
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          monthly_price_chf: number
          region?: string | null
          start_date: string
          tier: number
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          monthly_price_chf?: number
          region?: string | null
          start_date?: string
          tier?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsored_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsored_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          advanced_analytics: boolean | null
          auto_bidding: boolean | null
          competitor_insights: boolean | null
          created_at: string | null
          description: string | null
          display_order: number | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_leads_per_month: number | null
          name: string
          price_monthly: number
          price_yearly: number | null
          priority_level: number | null
          tier_name: string | null
          updated_at: string | null
        }
        Insert: {
          advanced_analytics?: boolean | null
          auto_bidding?: boolean | null
          competitor_insights?: boolean | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_leads_per_month?: number | null
          name: string
          price_monthly: number
          price_yearly?: number | null
          priority_level?: number | null
          tier_name?: string | null
          updated_at?: string | null
        }
        Update: {
          advanced_analytics?: boolean | null
          auto_bidding?: boolean | null
          competitor_insights?: boolean | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_leads_per_month?: number | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          priority_level?: number | null
          tier_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      provider_conversion_stats: {
        Row: {
          avg_days_to_convert: number | null
          avg_job_value: number | null
          conversion_rate: number | null
          converted_leads: number | null
          lost_leads: number | null
          pending_leads: number | null
          provider_id: string | null
          total_leads: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_transactions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_transactions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers_public: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"] | null
          avg_completion_time_hours: number | null
          booking_calendar_url: string | null
          cantons_served: string[] | null
          certifications: string[] | null
          cities_served: string[] | null
          city: string | null
          company_name: string | null
          contact_person_name: string | null
          country: string | null
          created_at: string | null
          description: string | null
          discount_offer: string | null
          employees_count: number | null
          featured_position: number | null
          fleet_size: number | null
          id: string | null
          is_featured: boolean | null
          logo_url: string | null
          long_description: string | null
          price_level: Database["public"]["Enums"]["price_level"] | null
          profile_completeness: number | null
          profile_gallery: string[] | null
          quality_score: number | null
          ranking_position: number | null
          response_time_minutes: number | null
          services_offered: string[] | null
          short_description: string | null
          slug: string | null
          sponsored_tier: number | null
          success_rate: number | null
          team_members: Json | null
          updated_at: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website: string | null
          working_hours: Json | null
          zip: string | null
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          avg_completion_time_hours?: number | null
          booking_calendar_url?: string | null
          cantons_served?: string[] | null
          certifications?: string[] | null
          cities_served?: string[] | null
          city?: string | null
          company_name?: string | null
          contact_person_name?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          discount_offer?: string | null
          employees_count?: number | null
          featured_position?: number | null
          fleet_size?: number | null
          id?: string | null
          is_featured?: boolean | null
          logo_url?: string | null
          long_description?: string | null
          price_level?: Database["public"]["Enums"]["price_level"] | null
          profile_completeness?: number | null
          profile_gallery?: string[] | null
          quality_score?: number | null
          ranking_position?: number | null
          response_time_minutes?: number | null
          services_offered?: string[] | null
          short_description?: string | null
          slug?: string | null
          sponsored_tier?: number | null
          success_rate?: number | null
          team_members?: Json | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website?: string | null
          working_hours?: Json | null
          zip?: string | null
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          avg_completion_time_hours?: number | null
          booking_calendar_url?: string | null
          cantons_served?: string[] | null
          certifications?: string[] | null
          cities_served?: string[] | null
          city?: string | null
          company_name?: string | null
          contact_person_name?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          discount_offer?: string | null
          employees_count?: number | null
          featured_position?: number | null
          fleet_size?: number | null
          id?: string | null
          is_featured?: boolean | null
          logo_url?: string | null
          long_description?: string | null
          price_level?: Database["public"]["Enums"]["price_level"] | null
          profile_completeness?: number | null
          profile_gallery?: string[] | null
          quality_score?: number | null
          ranking_position?: number | null
          response_time_minutes?: number | null
          services_offered?: string[] | null
          short_description?: string | null
          slug?: string | null
          sponsored_tier?: number | null
          success_rate?: number | null
          team_members?: Json | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website?: string | null
          working_hours?: Json | null
          zip?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_provider_match_score: {
        Args: { p_lead_id: string; p_provider_id: string }
        Returns: number
      }
      capture_ranking_benchmark: { Args: { p_notes?: string }; Returns: string }
      check_rate_limit: {
        Args: {
          p_action_type: string
          p_identifier: string
          p_max_attempts: number
          p_window_minutes: number
        }
        Returns: boolean
      }
      close_lead_bidding: { Args: { p_lead_id: string }; Returns: Json }
      count_provider_leads_this_month: {
        Args: { provider_id: string }
        Returns: number
      }
      find_matching_providers: {
        Args: {
          estimated_value?: number
          lead_from_postal: string
          lead_to_postal: string
        }
        Returns: string[]
      }
      get_canton_from_postal: { Args: { postal_code: string }; Returns: string }
      get_homepage_ab_stats: {
        Args: { p_days?: number }
        Returns: {
          conversion_rate: number
          cta_clicks: number
          cta_rate: number
          flow_variant: string
          funnel_rate: number
          funnel_starts: number
          impressions: number
          lead_submits: number
        }[]
      }
      get_provider_conversion_history: {
        Args: { p_provider_id: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      provider_can_receive_lead: {
        Args: { provider_id: string }
        Returns: boolean
      }
      provider_has_active_subscription: {
        Args: { provider_id: string }
        Returns: boolean
      }
      validate_email: { Args: { email: string }; Returns: boolean }
      validate_phone: { Args: { phone: string }; Returns: boolean }
    }
    Enums: {
      account_status: "active" | "inactive"
      app_role: "admin" | "user"
      price_level: "günstig" | "fair" | "premium"
      verification_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["active", "inactive"],
      app_role: ["admin", "user"],
      price_level: ["günstig", "fair", "premium"],
      verification_status: ["pending", "approved", "rejected"],
    },
  },
} as const
