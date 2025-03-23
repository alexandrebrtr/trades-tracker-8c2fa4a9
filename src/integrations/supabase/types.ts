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
      asset_allocations: {
        Row: {
          allocation: number
          created_at: string | null
          id: string
          name: string
          portfolio_id: string
          updated_at: string | null
        }
        Insert: {
          allocation: number
          created_at?: string | null
          id?: string
          name: string
          portfolio_id: string
          updated_at?: string | null
        }
        Update: {
          allocation?: number
          created_at?: string | null
          id?: string
          name?: string
          portfolio_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_allocations_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          response: string | null
          response_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          response?: string | null
          response_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          response?: string | null
          response_at?: string | null
        }
        Relationships: []
      }
      forum_topics: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          likes_count: number | null
          replies_count: number | null
          title: string
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          likes_count?: number | null
          replies_count?: number | null
          title: string
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          likes_count?: number | null
          replies_count?: number | null
          title?: string
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          balance: number | null
          banned: boolean | null
          banned_at: string | null
          bio: string | null
          created_at: string | null
          id: string
          phone: string | null
          premium: boolean | null
          premium_expires: string | null
          premium_since: string | null
          settings: Json | null
          trades_count: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          balance?: number | null
          banned?: boolean | null
          banned_at?: string | null
          bio?: string | null
          created_at?: string | null
          id: string
          phone?: string | null
          premium?: boolean | null
          premium_expires?: string | null
          premium_since?: string | null
          settings?: Json | null
          trades_count?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          balance?: number | null
          banned?: boolean | null
          banned_at?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          phone?: string | null
          premium?: boolean | null
          premium_expires?: string | null
          premium_since?: string | null
          settings?: Json | null
          trades_count?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          created_at: string | null
          date: string | null
          entry_price: number
          exit_price: number
          fees: number | null
          id: string
          notes: string | null
          pnl: number | null
          size: number
          strategy: string | null
          symbol: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          entry_price: number
          exit_price: number
          fees?: number | null
          id?: string
          notes?: string | null
          pnl?: number | null
          size: number
          strategy?: string | null
          symbol: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          entry_price?: number
          exit_price?: number
          fees?: number | null
          id?: string
          notes?: string | null
          pnl?: number | null
          size?: number
          strategy?: string | null
          symbol?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
