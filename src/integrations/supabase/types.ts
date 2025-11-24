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
          services?: string[] | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_provider_ids: string[] | null
          calculator_input: Json
          calculator_output: Json
          calculator_type: string
          comments: string | null
          created_at: string | null
          email: string
          from_city: string
          from_postal: string
          id: string
          lead_source: string | null
          move_date: string | null
          name: string
          phone: string | null
          status: string | null
          to_city: string
          to_postal: string
        }
        Insert: {
          assigned_provider_ids?: string[] | null
          calculator_input: Json
          calculator_output: Json
          calculator_type: string
          comments?: string | null
          created_at?: string | null
          email: string
          from_city: string
          from_postal: string
          id?: string
          lead_source?: string | null
          move_date?: string | null
          name: string
          phone?: string | null
          status?: string | null
          to_city: string
          to_postal: string
        }
        Update: {
          assigned_provider_ids?: string[] | null
          calculator_input?: Json
          calculator_output?: Json
          calculator_type?: string
          comments?: string | null
          created_at?: string | null
          email?: string
          from_city?: string
          from_postal?: string
          id?: string
          lead_source?: string | null
          move_date?: string | null
          name?: string
          phone?: string | null
          status?: string | null
          to_city?: string
          to_postal?: string
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
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
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
