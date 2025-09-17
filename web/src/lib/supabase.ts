import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (based on your Prisma schema)
export type Database = {
  public: {
    Tables: {
      User: {
        Row: {
          id: string
          email: string
          name: string | null
          image: string | null
          videoUrl: string | null
          passwordHash: string | null
          provider: string
          role: 'ADMIN' | 'INQUILINO' | 'PROPIETARIO'
          plan: string
          city: string | null
          noiseLevel: number | null
          maxDistanceKm: number | null
          about: string | null
          tags: string[]
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          image?: string | null
          videoUrl?: string | null
          passwordHash?: string | null
          provider?: string
          role?: 'ADMIN' | 'INQUILINO' | 'PROPIETARIO'
          plan?: string
          city?: string | null
          noiseLevel?: number | null
          maxDistanceKm?: number | null
          about?: string | null
          tags?: string[]
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          image?: string | null
          videoUrl?: string | null
          passwordHash?: string | null
          provider?: string
          role?: 'ADMIN' | 'INQUILINO' | 'PROPIETARIO'
          plan?: string
          city?: string | null
          noiseLevel?: number | null
          maxDistanceKm?: number | null
          about?: string | null
          tags?: string[]
          createdAt?: string
          updatedAt?: string
        }
      }
      Property: {
        Row: {
          id: string
          ownerId: string
          title: string
          description: string
          city: string | null
          priceMonthly: number
          photos: string[]
          visibility: 'PUBLIC' | 'MATCHED_ONLY'
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          ownerId: string
          title: string
          description: string
          city?: string | null
          priceMonthly: number
          photos?: string[]
          visibility?: 'PUBLIC' | 'MATCHED_ONLY'
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          ownerId?: string
          title?: string
          description?: string
          city?: string | null
          priceMonthly?: number
          photos?: string[]
          visibility?: 'PUBLIC' | 'MATCHED_ONLY'
          createdAt?: string
          updatedAt?: string
        }
      }
      RoommateLike: {
        Row: {
          id: string
          userAId: string
          userBId: string
          score: number
          status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          userAId: string
          userBId: string
          score: number
          status?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          userAId?: string
          userBId?: string
          score?: number
          status?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
          createdAt?: string
          updatedAt?: string
        }
      }
      PropertyMatch: {
        Row: {
          id: string
          propertyId: string
          tenantId: string
          score: number
          status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          propertyId: string
          tenantId: string
          score: number
          status?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          propertyId?: string
          tenantId?: string
          score?: number
          status?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
          createdAt?: string
          updatedAt?: string
        }
      }
      Blog: {
        Row: {
          id: string
          title: string
          content: string
          published: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          published?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          published?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      SmtpSetting: {
        Row: {
          id: string
          host: string
          port: number
          user: string
          fromEmail: string
          secure: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          host: string
          port: number
          user: string
          fromEmail: string
          secure?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          host?: string
          port?: number
          user?: string
          fromEmail?: string
          secure?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      ApiKey: {
        Row: {
          id: string
          userId: string
          label: string
          keyHash: string
          active: boolean
          createdAt: string
          lastUsedAt: string | null
        }
        Insert: {
          id?: string
          userId: string
          label: string
          keyHash: string
          active?: boolean
          createdAt?: string
          lastUsedAt?: string | null
        }
        Update: {
          id?: string
          userId?: string
          label?: string
          keyHash?: string
          active?: boolean
          createdAt?: string
          lastUsedAt?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Role: 'ADMIN' | 'INQUILINO' | 'PROPIETARIO'
      Visibility: 'PUBLIC' | 'MATCHED_ONLY'
      MatchStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED'
    }
  }
}