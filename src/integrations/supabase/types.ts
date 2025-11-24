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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
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
        ]
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
      service_providers: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"]
          cantons_served: string[]
          city: string
          company_name: string
          contact_person_name: string
          country: string
          created_at: string
          description: string | null
          email: string
          employees_count: number | null
          fleet_size: number | null
          id: string
          logo_url: string | null
          max_leads_per_month: number | null
          min_job_value: number | null
          password_hash: string
          phone: string
          preferred_regions: string[] | null
          price_level: Database["public"]["Enums"]["price_level"] | null
          services_offered: string[]
          street: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          website: string | null
          zip: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"]
          cantons_served?: string[]
          city: string
          company_name: string
          contact_person_name: string
          country?: string
          created_at?: string
          description?: string | null
          email: string
          employees_count?: number | null
          fleet_size?: number | null
          id?: string
          logo_url?: string | null
          max_leads_per_month?: number | null
          min_job_value?: number | null
          password_hash: string
          phone: string
          preferred_regions?: string[] | null
          price_level?: Database["public"]["Enums"]["price_level"] | null
          services_offered?: string[]
          street: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          website?: string | null
          zip: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"]
          cantons_served?: string[]
          city?: string
          company_name?: string
          contact_person_name?: string
          country?: string
          created_at?: string
          description?: string | null
          email?: string
          employees_count?: number | null
          fleet_size?: number | null
          id?: string
          logo_url?: string | null
          max_leads_per_month?: number | null
          min_job_value?: number | null
          password_hash?: string
          phone?: string
          preferred_regions?: string[] | null
          price_level?: Database["public"]["Enums"]["price_level"] | null
          services_offered?: string[]
          street?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          website?: string | null
          zip?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_leads_per_month: number | null
          name: string
          price_monthly: number
          price_yearly: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_leads_per_month?: number | null
          name: string
          price_monthly: number
          price_yearly?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_leads_per_month?: number | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
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
        ]
      }
    }
    Functions: {
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
