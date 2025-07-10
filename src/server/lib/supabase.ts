import { createClient } from '@supabase/supabase-js'

// These will be set from environment variables
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Create Supabase client with anon key (for client-side operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
})

// Create Supabase client with service role key (for server-side operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
})

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Types for Supabase tables (generated from our Prisma schema)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          first_name: string | null
          last_name: string | null
          role: 'USER' | 'ADMIN'
          created_at: string
          updated_at: string
          last_login_at: string | null
          is_active: boolean
          email_verified: boolean
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          first_name?: string | null
          last_name?: string | null
          role?: 'USER' | 'ADMIN'
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          email_verified?: boolean
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          first_name?: string | null
          last_name?: string | null
          role?: 'USER' | 'ADMIN'
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          email_verified?: boolean
        }
      }
      // Add other table types as needed
    }
  }
}
