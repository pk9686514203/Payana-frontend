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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          address: string | null
          agency_name: string
          created_at: string
          description: string | null
          email: string | null
          id: string
          instagram: string | null
          is_verified: boolean
          logo_url: string | null
          owner_name: string
          phone: string
          status: Database["public"]["Enums"]["approval_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          agency_name: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          is_verified?: boolean
          logo_url?: string | null
          owner_name: string
          phone: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          agency_name?: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          is_verified?: boolean
          logo_url?: string | null
          owner_name?: string
          phone?: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_id: string
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: string
          message: string | null
          package_id: string | null
          passengers: number
          pickup_location: string | null
          status: Database["public"]["Enums"]["booking_status"]
          travel_date: string
          updated_at: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          message?: string | null
          package_id?: string | null
          passengers?: number
          pickup_location?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          travel_date: string
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          message?: string | null
          package_id?: string | null
          passengers?: number
          pickup_location?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          travel_date?: string
          updated_at?: string
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          agent_id: string
          created_at: string
          description: string | null
          duration: string
          id: string
          images: string[] | null
          includes: string[] | null
          itinerary: Json | null
          locations: string[]
          price: number
          status: Database["public"]["Enums"]["approval_status"]
          title: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          description?: string | null
          duration: string
          id?: string
          images?: string[] | null
          includes?: string[] | null
          itinerary?: Json | null
          locations?: string[]
          price: number
          status?: Database["public"]["Enums"]["approval_status"]
          title: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          description?: string | null
          duration?: string
          id?: string
          images?: string[] | null
          includes?: string[] | null
          itinerary?: Json | null
          locations?: string[]
          price?: number
          status?: Database["public"]["Enums"]["approval_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "packages_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_owners: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          is_verified: boolean
          owner_name: string
          phone: string
          status: Database["public"]["Enums"]["approval_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_verified?: boolean
          owner_name: string
          phone: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_verified?: boolean
          owner_name?: string
          phone?: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          contact_phone: string | null
          created_at: string
          id: string
          images: string[] | null
          location: string
          owner_id: string
          price_per_km: number
          seats: number
          status: Database["public"]["Enums"]["approval_status"]
          updated_at: string
          vehicle_name: string
          vehicle_type: string
        }
        Insert: {
          contact_phone?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          location: string
          owner_id: string
          price_per_km: number
          seats: number
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          vehicle_name: string
          vehicle_type: string
        }
        Update: {
          contact_phone?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          location?: string
          owner_id?: string
          price_per_km?: number
          seats?: number
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          vehicle_name?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "vehicle_owners"
            referencedColumns: ["id"]
          },
        ]
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
      is_agent_owner: { Args: { _agent_id: string }; Returns: boolean }
      is_vehicle_owner: { Args: { _owner_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "customer" | "agent" | "vehicle_owner"
      approval_status: "pending" | "approved" | "rejected"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
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
      app_role: ["admin", "customer", "agent", "vehicle_owner"],
      approval_status: ["pending", "approved", "rejected"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
    },
  },
} as const
