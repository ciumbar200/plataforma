import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  name?: string
  image?: string
  role: 'ADMIN' | 'INQUILINO' | 'PROPIETARIO'
  plan: string
  city?: string
  noiseLevel?: number
  maxDistanceKm?: number
  about?: string
  tags: string[]
}

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, userData: Partial<AuthUser> = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'INQUILINO',
            plan: userData.plan || 'standard',
            city: userData.city,
            noiseLevel: userData.noiseLevel,
            maxDistanceKm: userData.maxDistanceKm,
            about: userData.about,
            tags: userData.tags || []
          }
        }
      })

      if (error) throw error

      // Create user profile in our custom User table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('User')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name: userData.name,
            role: userData.role || 'INQUILINO',
            plan: userData.plan || 'standard',
            city: userData.city,
            noiseLevel: userData.noiseLevel,
            maxDistanceKm: userData.maxDistanceKm,
            about: userData.about,
            tags: userData.tags || []
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
        }
      }

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  // Sign in with Google
  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  // Get current session
  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      
      if (!user) return null

      // Get user profile from our custom User table
      const { data: profile, error: profileError } = await supabase
        .from('User')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Error fetching user profile:', profileError)
        return null
      }

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        image: profile.image,
        role: profile.role,
        plan: profile.plan,
        city: profile.city,
        noiseLevel: profile.noiseLevel,
        maxDistanceKm: profile.maxDistanceKm,
        about: profile.about,
        tags: profile.tags
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  // Update user profile
  static async updateProfile(updates: Partial<AuthUser>) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!user) throw new Error('No authenticated user')

      const { error } = await supabase
        .from('User')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      if (error) throw error
      return true
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  // Update password
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (error) throw error
      return true
    } catch (error) {
      console.error('Update password error:', error)
      throw error
    }
  }
}