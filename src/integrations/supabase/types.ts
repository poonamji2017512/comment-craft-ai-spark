export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      billing_history: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          dodo_payment_id: string | null
          id: string
          payment_date: string
          status: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          dodo_payment_id?: string | null
          id?: string
          payment_date?: string
          status: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          dodo_payment_id?: string | null
          id?: string
          payment_date?: string
          status?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      event_logs: {
        Row: {
          event_type: string
          id: string
          metadata: Json | null
          timestamp: string
          user_id: string
        }
        Insert: {
          event_type: string
          id?: string
          metadata?: Json | null
          timestamp?: string
          user_id: string
        }
        Update: {
          event_type?: string
          id?: string
          metadata?: Json | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      generated_comments: {
        Row: {
          character_count: number
          created_at: string
          generated_text: string
          id: string
          original_post: string
          platform: string
          tone: string
          user_id: string
        }
        Insert: {
          character_count: number
          created_at?: string
          generated_text: string
          id?: string
          original_post: string
          platform: string
          tone: string
          user_id: string
        }
        Update: {
          character_count?: number
          created_at?: string
          generated_text?: string
          id?: string
          original_post?: string
          platform?: string
          tone?: string
          user_id?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          created_at: string
          id: string
          input_text: string
          session_id: string
          tone: Database["public"]["Enums"]["tone_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_text: string
          session_id: string
          tone?: Database["public"]["Enums"]["tone_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          input_text?: string
          session_id?: string
          tone?: Database["public"]["Enums"]["tone_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          created_at: string
          id: string
          prompt_id: string
          response_text: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_id: string
          response_text: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt_id?: string
          response_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          id: string
          platform: Database["public"]["Enums"]["platform_type"]
          topic: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: Database["public"]["Enums"]["platform_type"]
          topic: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: Database["public"]["Enums"]["platform_type"]
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          dodo_customer_id: string | null
          dodo_subscription_id: string | null
          id: string
          plan_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          dodo_customer_id?: string | null
          dodo_subscription_id?: string | null
          id?: string
          plan_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          dodo_customer_id?: string | null
          dodo_subscription_id?: string | null
          id?: string
          plan_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          daily_prompt_count: number | null
          email: string | null
          full_name: string | null
          id: string
          last_login: string | null
          last_prompt_reset: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          daily_prompt_count?: number | null
          email?: string | null
          full_name?: string | null
          id: string
          last_login?: string | null
          last_prompt_reset?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          daily_prompt_count?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          last_prompt_reset?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          ai_features: Json | null
          ai_model: string | null
          ai_tone: string | null
          created_at: string
          custom_api_key: string | null
          dashboard_view: string | null
          id: string
          language: string | null
          notification_prefs: Json | null
          summary_length: string | null
          theme: string | null
          timezone: string | null
          updated_at: string
          use_custom_api_key: boolean | null
          user_id: string
        }
        Insert: {
          ai_features?: Json | null
          ai_model?: string | null
          ai_tone?: string | null
          created_at?: string
          custom_api_key?: string | null
          dashboard_view?: string | null
          id?: string
          language?: string | null
          notification_prefs?: Json | null
          summary_length?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          use_custom_api_key?: boolean | null
          user_id: string
        }
        Update: {
          ai_features?: Json | null
          ai_model?: string | null
          ai_tone?: string | null
          created_at?: string
          custom_api_key?: string | null
          dashboard_view?: string | null
          id?: string
          language?: string | null
          notification_prefs?: Json | null
          summary_length?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          use_custom_api_key?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      platform_type: "twitter" | "linkedin" | "reddit" | "bluesky"
      tone_type:
        | "professional"
        | "casual"
        | "enthusiastic"
        | "supportive"
        | "humorous"
        | "critical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      platform_type: ["twitter", "linkedin", "reddit", "bluesky"],
      tone_type: [
        "professional",
        "casual",
        "enthusiastic",
        "supportive",
        "humorous",
        "critical",
      ],
    },
  },
} as const
