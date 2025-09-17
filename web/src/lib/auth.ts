import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: 'ADMIN' | 'INQUILINO' | 'PROPIETARIO'
  plan: string
  image?: string
  videoUrl?: string
}

export class AuthService {
  static async signUp(email: string, password: string, userData: { name: string; role: 'INQUILINO' | 'PROPIETARIO' }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            plan: 'FREE'
          }
        }
      })

      if (error) throw error

      // Create user profile in database
      if (data.user) {
        const { error: profileError } = await supabase
          .from('User')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name: userData.name,
            role: userData.role,
            plan: 'FREE'
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }
      }

      return data
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

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

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const session = await this.getCurrentSession()
      if (!session?.user) return null

      // Get user profile from database
      const { data: profile, error } = await supabase
        .from('User')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Get user profile error:', error)
        // Return basic user info from auth if profile doesn't exist
        return {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email,
          role: session.user.user_metadata?.role || 'INQUILINO',
          plan: 'FREE'
        }
      }

      return profile as AuthUser
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  static async updateProfile(updates: Partial<AuthUser>) {
    try {
      const session = await this.getCurrentSession()
      if (!session?.user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('User')
        .update(updates)
        .eq('id', session.user.id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  static async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}