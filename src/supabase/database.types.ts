export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string
          household_id: number | null
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          household_id?: number | null
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          household_id?: number | null
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_household_id_fkey"
            columns: ["household_id"]
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      households: {
        Row: {
          created_at: string
          id: number
          uuid: string
        }
        Insert: {
          created_at?: string
          id?: number
          uuid?: string
        }
        Update: {
          created_at?: string
          id?: number
          uuid?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          amount: string | null
          id: number
          name: string
          recipe: number
        }
        Insert: {
          amount?: string | null
          id?: number
          name?: string
          recipe: number
        }
        Update: {
          amount?: string | null
          id?: number
          name?: string
          recipe?: number
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_recipe_fkey"
            columns: ["recipe"]
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          }
        ]
      }
      recipes: {
        Row: {
          created_at: string
          effort_level: number
          estimated_cook_time: number
          household_id: number
          id: number
          last_used: string | null
          name: string
          season_end_date: string | null
          season_start_date: string | null
        }
        Insert: {
          created_at?: string
          effort_level?: number
          estimated_cook_time?: number
          household_id: number
          id?: number
          last_used?: string | null
          name?: string
          season_end_date?: string | null
          season_start_date?: string | null
        }
        Update: {
          created_at?: string
          effort_level?: number
          estimated_cook_time?: number
          household_id?: number
          id?: number
          last_used?: string | null
          name?: string
          season_end_date?: string | null
          season_start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            referencedRelation: "households"
            referencedColumns: ["id"]
          }
        ]
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
