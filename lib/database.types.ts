export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          created_at: string
          description: string | null
          id: string
          identifier: string | null
          name: string | null
          prompt: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          identifier?: string | null
          name?: string | null
          prompt?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          identifier?: string | null
          name?: string | null
          prompt?: string | null
        }
        Relationships: []
      }
      exercises: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          name: string
          reps: string | null
          sets: number | null
          video_id: string | null
          weight: string | null
          workout_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          reps?: string | null
          sets?: number | null
          video_id?: string | null
          weight?: string | null
          workout_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          reps?: string | null
          sets?: number | null
          video_id?: string | null
          weight?: string | null
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          id: string
          name: string | null
          phone: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          calories: number
          carbs: string | null
          created_at: string | null
          day_of_week: string
          fat: string | null
          foods: string[] | null
          id: string
          meal_type: string
          protein: string | null
          user_id: string | null
        }
        Insert: {
          calories: number
          carbs?: string | null
          created_at?: string | null
          day_of_week: string
          fat?: string | null
          foods?: string[] | null
          id?: string
          meal_type: string
          protein?: string | null
          user_id?: string | null
        }
        Update: {
          calories?: number
          carbs?: string | null
          created_at?: string | null
          day_of_week?: string
          fat?: string | null
          foods?: string[] | null
          id?: string
          meal_type?: string
          protein?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_questions: {
        Row: {
          conditional_logic: Json | null
          created_at: string | null
          emoji: string | null
          field_name: string
          icon: string | null
          id: string
          is_active: boolean | null
          options: Json | null
          placeholder: string | null
          question_type: string
          required: boolean | null
          send_in:
            | Database["public"]["Enums"]["send_onboarding_question"]
            | null
          step_number: number
          subtitle: string | null
          title: string
          updated_at: string | null
          validation: Json | null
        }
        Insert: {
          conditional_logic?: Json | null
          created_at?: string | null
          emoji?: string | null
          field_name: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json | null
          placeholder?: string | null
          question_type: string
          required?: boolean | null
          send_in?:
            | Database["public"]["Enums"]["send_onboarding_question"]
            | null
          step_number: number
          subtitle?: string | null
          title: string
          updated_at?: string | null
          validation?: Json | null
        }
        Update: {
          conditional_logic?: Json | null
          created_at?: string | null
          emoji?: string | null
          field_name?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json | null
          placeholder?: string | null
          question_type?: string
          required?: boolean | null
          send_in?:
            | Database["public"]["Enums"]["send_onboarding_question"]
            | null
          step_number?: number
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          validation?: Json | null
        }
        Relationships: []
      }
      onboarding_responses: {
        Row: {
          completed_at: string | null
          id: string
          question_id: string | null
          response_array: string[] | null
          response_value: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          question_id?: string | null
          response_array?: string[] | null
          response_value?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          question_id?: string | null
          response_array?: string[] | null
          response_value?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "onboarding_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_photos: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          photo_url: string
          user_id: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          photo_url: string
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          photo_url?: string
          user_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          new_account: boolean | null
          nickname: string | null
          onboarding: boolean | null
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          new_account?: boolean | null
          nickname?: string | null
          onboarding?: boolean | null
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          new_account?: boolean | null
          nickname?: string | null
          onboarding?: boolean | null
          phone?: string | null
        }
        Relationships: []
      }
      weight_updates: {
        Row: {
          change: number | null
          created_at: string | null
          date: string | null
          has_photo: boolean | null
          id: string
          photo_url: string | null
          user_id: string | null
          weight: number
        }
        Insert: {
          change?: number | null
          created_at?: string | null
          date?: string | null
          has_photo?: boolean | null
          id?: string
          photo_url?: string | null
          user_id?: string | null
          weight: number
        }
        Update: {
          change?: number | null
          created_at?: string | null
          date?: string | null
          has_photo?: boolean | null
          id?: string
          photo_url?: string | null
          user_id?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "weight_updates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          completed: boolean | null
          created_at: string | null
          duration: number | null
          emoji: string | null
          exercises: number | null
          id: string
          title: string
          total_sets: number | null
          user_id: string | null
          workout_date: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          duration?: number | null
          emoji?: string | null
          exercises?: number | null
          id?: string
          title: string
          total_sets?: number | null
          user_id?: string | null
          workout_date?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          duration?: number | null
          emoji?: string | null
          exercises?: number | null
          id?: string
          title?: string
          total_sets?: number | null
          user_id?: string | null
          workout_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_onboarding_progress: {
        Args: { p_lead_id: string }
        Returns: Json
      }
    }
    Enums: {
      send_onboarding_question: "whatsapp" | "link"
      type_onboarding: "text_field" | "radio_button" | "selection_multiple"
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
      send_onboarding_question: ["whatsapp", "link"],
      type_onboarding: ["text_field", "radio_button", "selection_multiple"],
    },
  },
} as const