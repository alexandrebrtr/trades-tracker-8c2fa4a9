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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          account_id: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content?: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_user_memory: {
        Row: {
          goals: string | null
          notes: Json
          preferences: string | null
          risk_profile: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          goals?: string | null
          notes?: Json
          preferences?: string | null
          risk_profile?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          goals?: string | null
          notes?: Json
          preferences?: string | null
          risk_profile?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
          account_id: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
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
      custom_charts: {
        Row: {
          account_id: string | null
          config: Json
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          config: Json
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          config?: Json
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
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
      ratings: {
        Row: {
          created_at: string
          id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          avatar_url: string | null
          created_at: string
          id: string
          rating: number
          role: string
          text: string
        }
        Insert: {
          author: string
          avatar_url?: string | null
          created_at?: string
          id?: string
          rating: number
          role: string
          text: string
        }
        Update: {
          author?: string
          avatar_url?: string | null
          created_at?: string
          id?: string
          rating?: number
          role?: string
          text?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          account_id: string | null
          asset_class: string | null
          contract_size: number | null
          created_at: string | null
          date: string | null
          delta: number | null
          entry_price: number
          exit_price: number
          expiration: string | null
          fees: number | null
          gamma: number | null
          id: string
          implied_volatility: number | null
          instrument_type: string | null
          market: string | null
          multiplier: number | null
          notes: string | null
          option_type: string | null
          pnl: number | null
          premium: number | null
          quote_currency: string | null
          rho: number | null
          risk_free_rate: number | null
          sector: string | null
          size: number
          stop_loss: number | null
          strategy: string | null
          strike: number | null
          symbol: string
          take_profit: number | null
          theta: number | null
          type: string
          underlying_price: number | null
          updated_at: string | null
          user_id: string
          vega: number | null
        }
        Insert: {
          account_id?: string | null
          asset_class?: string | null
          contract_size?: number | null
          created_at?: string | null
          date?: string | null
          delta?: number | null
          entry_price: number
          exit_price: number
          expiration?: string | null
          fees?: number | null
          gamma?: number | null
          id?: string
          implied_volatility?: number | null
          instrument_type?: string | null
          market?: string | null
          multiplier?: number | null
          notes?: string | null
          option_type?: string | null
          pnl?: number | null
          premium?: number | null
          quote_currency?: string | null
          rho?: number | null
          risk_free_rate?: number | null
          sector?: string | null
          size: number
          stop_loss?: number | null
          strategy?: string | null
          strike?: number | null
          symbol: string
          take_profit?: number | null
          theta?: number | null
          type: string
          underlying_price?: number | null
          updated_at?: string | null
          user_id: string
          vega?: number | null
        }
        Update: {
          account_id?: string | null
          asset_class?: string | null
          contract_size?: number | null
          created_at?: string | null
          date?: string | null
          delta?: number | null
          entry_price?: number
          exit_price?: number
          expiration?: string | null
          fees?: number | null
          gamma?: number | null
          id?: string
          implied_volatility?: number | null
          instrument_type?: string | null
          market?: string | null
          multiplier?: number | null
          notes?: string | null
          option_type?: string | null
          pnl?: number | null
          premium?: number | null
          quote_currency?: string | null
          rho?: number | null
          risk_free_rate?: number | null
          sector?: string | null
          size?: number
          stop_loss?: number | null
          strategy?: string | null
          strike?: number | null
          symbol?: string
          take_profit?: number | null
          theta?: number | null
          type?: string
          underlying_price?: number | null
          updated_at?: string | null
          user_id?: string
          vega?: number | null
        }
        Relationships: []
      }
      trading_accounts: {
        Row: {
          account_type: string
          archived: boolean
          balance: number
          broker: string | null
          created_at: string
          currency: string
          daily_drawdown: number | null
          id: string
          initial_capital: number
          is_default: boolean
          leverage: number
          max_drawdown: number | null
          name: string
          profit_target: number | null
          prop_firm_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string
          archived?: boolean
          balance?: number
          broker?: string | null
          created_at?: string
          currency?: string
          daily_drawdown?: number | null
          id?: string
          initial_capital?: number
          is_default?: boolean
          leverage?: number
          max_drawdown?: number | null
          name: string
          profit_target?: number | null
          prop_firm_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string
          archived?: boolean
          balance?: number
          broker?: string | null
          created_at?: string
          currency?: string
          daily_drawdown?: number | null
          id?: string
          initial_capital?: number
          is_default?: boolean
          leverage?: number
          max_drawdown?: number | null
          name?: string
          profit_target?: number | null
          prop_firm_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string
          date: string
          id: string
          notes: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      recalculate_account_balance: {
        Args: { _account_id: string }
        Returns: number
      }
      recalculate_user_balance: { Args: { _user_id: string }; Returns: number }
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
