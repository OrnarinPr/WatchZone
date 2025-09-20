// src/lib/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type IdStatus = 'available' | 'in_use' | 'expired' | 'retired'

export interface Database {
  public: {
    Tables: {
      id_types: {
        Row: {
          id: number
          code: string
          name: string
          default_duration_days: number
          created_at: string
        }
        Insert: {
          id?: number
          code: string
          name: string
          default_duration_days: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['id_types']['Insert']>
        Relationships: []
      }

      ids: {
        Row: {
          id: number
          type_id: number
          status: IdStatus
          username: string | null
          password: string | null
          created_at: string
          claimed_at: string | null
          lease_expires_at: string | null
          released_at: string | null
          notes: string | null
        }
        Insert: {
          id?: number
          type_id: number
          status?: IdStatus
          username?: string | null
          password?: string | null
          created_at?: string
          claimed_at?: string | null
          lease_expires_at?: string | null
          released_at?: string | null
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['ids']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'ids_type_id_fkey'
            columns: ['type_id']
            isOneToOne: false
            referencedRelation: 'id_types'
            referencedColumns: ['id']
          }
        ]
      }

      id_usage: {
        Row: {
          id: number
          id_id: number
          action: string
          at: string
          extra: Json | null
        }
        Insert: {
          id?: number
          id_id: number
          action: string
          at?: string
          extra?: Json | null
        }
        Update: Partial<Database['public']['Tables']['id_usage']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'id_usage_id_id_fkey'
            columns: ['id_id']
            isOneToOne: false
            referencedRelation: 'ids'
            referencedColumns: ['id']
          }
        ]
      }
    }

    Views: {
      v_ids_with_code: {
        Row: {
          id: number
          code: string
          full_id: string
          status: IdStatus
          username: string | null
          password: string | null
          claimed_at: string | null
          lease_expires_at: string | null
          created_at?: string | null
          released_at?: string | null
          type_id?: number | null
        }
        Relationships: []
      }
      // (ถ้ามี v_id_stats_per_type จะเพิ่มภายหลัง)
    }

    Functions: {
      // ใส่เพิ่มทีหลังได้หากเรียก RPC
    }

    Enums: {
      id_status: IdStatus
    }
  }
}
