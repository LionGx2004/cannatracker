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
      effects: {
        Row: {
          category: string
          created_at: string
          description: string | null
          description_de: string | null
          id: string
          name: string
          name_de: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          description_de?: string | null
          id?: string
          name: string
          name_de: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          description_de?: string | null
          id?: string
          name?: string
          name_de?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          strain: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          strain: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          strain?: string
          user_id?: string
        }
        Relationships: []
      }
      strain_effects: {
        Row: {
          effect_id: string
          id: string
          intensity: string | null
          strain_id: string
        }
        Insert: {
          effect_id: string
          id?: string
          intensity?: string | null
          strain_id: string
        }
        Update: {
          effect_id?: string
          id?: string
          intensity?: string | null
          strain_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strain_effects_effect_id_fkey"
            columns: ["effect_id"]
            isOneToOne: false
            referencedRelation: "effects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strain_effects_strain_id_fkey"
            columns: ["strain_id"]
            isOneToOne: false
            referencedRelation: "strains"
            referencedColumns: ["id"]
          },
        ]
      }
      strain_terpenes: {
        Row: {
          dominance: string | null
          id: string
          strain_id: string
          terpene_id: string
        }
        Insert: {
          dominance?: string | null
          id?: string
          strain_id: string
          terpene_id: string
        }
        Update: {
          dominance?: string | null
          id?: string
          strain_id?: string
          terpene_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strain_terpenes_strain_id_fkey"
            columns: ["strain_id"]
            isOneToOne: false
            referencedRelation: "strains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strain_terpenes_terpene_id_fkey"
            columns: ["terpene_id"]
            isOneToOne: false
            referencedRelation: "terpenes"
            referencedColumns: ["id"]
          },
        ]
      }
      strains: {
        Row: {
          aroma: string | null
          aroma_de: string | null
          cbd_max: number | null
          cbd_min: number | null
          created_at: string
          description: string | null
          description_de: string | null
          flavor: string | null
          flavor_de: string | null
          id: string
          name: string
          thc_max: number | null
          thc_min: number | null
          type: string
        }
        Insert: {
          aroma?: string | null
          aroma_de?: string | null
          cbd_max?: number | null
          cbd_min?: number | null
          created_at?: string
          description?: string | null
          description_de?: string | null
          flavor?: string | null
          flavor_de?: string | null
          id?: string
          name: string
          thc_max?: number | null
          thc_min?: number | null
          type: string
        }
        Update: {
          aroma?: string | null
          aroma_de?: string | null
          cbd_max?: number | null
          cbd_min?: number | null
          created_at?: string
          description?: string | null
          description_de?: string | null
          flavor?: string | null
          flavor_de?: string | null
          id?: string
          name?: string
          thc_max?: number | null
          thc_min?: number | null
          type?: string
        }
        Relationships: []
      }
      terpenes: {
        Row: {
          also_found_in: string | null
          also_found_in_de: string | null
          created_at: string
          effects: string
          effects_de: string
          id: string
          name: string
          scent: string
          scent_de: string
        }
        Insert: {
          also_found_in?: string | null
          also_found_in_de?: string | null
          created_at?: string
          effects: string
          effects_de: string
          id?: string
          name: string
          scent: string
          scent_de: string
        }
        Update: {
          also_found_in?: string | null
          also_found_in_de?: string | null
          created_at?: string
          effects?: string
          effects_de?: string
          id?: string
          name?: string
          scent?: string
          scent_de?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_current_user: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
