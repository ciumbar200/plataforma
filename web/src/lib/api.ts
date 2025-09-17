import { supabase } from './supabase'
import type { Database } from './supabase'

type Tables = Database['public']['Tables']
type User = Tables['User']['Row']
type Property = Tables['Property']['Row']
type RoommateLike = Tables['RoommateLike']['Row']
type PropertyMatch = Tables['PropertyMatch']['Row']
type Blog = Tables['Blog']['Row']

export class ApiService {
  // User operations
  static async getUsers() {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('User')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteUser(id: string) {
    const { error } = await supabase
      .from('User')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  // Property operations
  static async getProperties(filters?: {
    city?: string
    maxPrice?: number
    visibility?: 'PUBLIC' | 'MATCHED_ONLY'
  }) {
    let query = supabase
      .from('Property')
      .select(`
        *,
        owner:User(id, name, email, image)
      `)
      .order('createdAt', { ascending: false })

    if (filters?.city) {
      query = query.eq('city', filters.city)
    }
    if (filters?.maxPrice) {
      query = query.lte('priceMonthly', filters.maxPrice)
    }
    if (filters?.visibility) {
      query = query.eq('visibility', filters.visibility)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  static async getPropertyById(id: string) {
    const { data, error } = await supabase
      .from('Property')
      .select(`
        *,
        owner:User(id, name, email, image)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async createProperty(property: Tables['Property']['Insert']) {
    const { data, error } = await supabase
      .from('Property')
      .insert(property)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateProperty(id: string, updates: Partial<Property>) {
    const { data, error } = await supabase
      .from('Property')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteProperty(id: string) {
    const { error } = await supabase
      .from('Property')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  static async getUserProperties(userId: string) {
    const { data, error } = await supabase
      .from('Property')
      .select('*')
      .eq('ownerId', userId)
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data
  }

  // Roommate matching operations
  static async getRoommateLikes(userId: string) {
    const { data, error } = await supabase
      .from('RoommateLike')
      .select(`
        *,
        userA:User!RoommateLike_userAId_fkey(id, name, email, image, city, about, tags),
        userB:User!RoommateLike_userBId_fkey(id, name, email, image, city, about, tags)
      `)
      .or(`userAId.eq.${userId},userBId.eq.${userId}`)
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data
  }

  static async createRoommateLike(like: Tables['RoommateLike']['Insert']) {
    const { data, error } = await supabase
      .from('RoommateLike')
      .insert(like)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateRoommateLike(id: string, updates: Partial<RoommateLike>) {
    const { data, error } = await supabase
      .from('RoommateLike')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Property matching operations
  static async getPropertyMatches(userId: string) {
    const { data, error } = await supabase
      .from('PropertyMatch')
      .select(`
        *,
        property:Property(
          *,
          owner:User(id, name, email, image)
        ),
        tenant:User(id, name, email, image, city, about)
      `)
      .or(`tenantId.eq.${userId},property.ownerId.eq.${userId}`)
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data
  }

  static async createPropertyMatch(match: Tables['PropertyMatch']['Insert']) {
    const { data, error } = await supabase
      .from('PropertyMatch')
      .insert(match)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updatePropertyMatch(id: string, updates: Partial<PropertyMatch>) {
    const { data, error } = await supabase
      .from('PropertyMatch')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Blog operations
  static async getBlogs(publishedOnly = true) {
    let query = supabase
      .from('Blog')
      .select('*')
      .order('createdAt', { ascending: false })

    if (publishedOnly) {
      query = query.eq('published', true)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  static async getBlogById(id: string) {
    const { data, error } = await supabase
      .from('Blog')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async createBlog(blog: Tables['Blog']['Insert']) {
    const { data, error } = await supabase
      .from('Blog')
      .insert(blog)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateBlog(id: string, updates: Partial<Blog>) {
    const { data, error } = await supabase
      .from('Blog')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteBlog(id: string) {
    const { error } = await supabase
      .from('Blog')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  // SMTP Settings operations (admin only)
  static async getSmtpSettings() {
    const { data, error } = await supabase
      .from('SmtpSetting')
      .select('*')
      .order('createdAt', { ascending: false })
      .limit(1)

    if (error) throw error
    return data[0] || null
  }

  static async updateSmtpSettings(settings: Tables['SmtpSetting']['Insert']) {
    // Delete existing settings first
    await supabase.from('SmtpSetting').delete().neq('id', '')

    const { data, error } = await supabase
      .from('SmtpSetting')
      .insert(settings)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // API Key operations
  static async getApiKeys(userId: string) {
    const { data, error } = await supabase
      .from('ApiKey')
      .select('id, label, active, createdAt, lastUsedAt')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data
  }

  static async createApiKey(apiKey: Tables['ApiKey']['Insert']) {
    const { data, error } = await supabase
      .from('ApiKey')
      .insert(apiKey)
      .select('id, label, active, createdAt, lastUsedAt')
      .single()

    if (error) throw error
    return data
  }

  static async updateApiKey(id: string, updates: { label?: string; active?: boolean }) {
    const { data, error } = await supabase
      .from('ApiKey')
      .update(updates)
      .eq('id', id)
      .select('id, label, active, createdAt, lastUsedAt')
      .single()

    if (error) throw error
    return data
  }

  static async deleteApiKey(id: string) {
    const { error } = await supabase
      .from('ApiKey')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  // Search and filtering
  static async searchUsers(query: string, filters?: {
    role?: 'ADMIN' | 'INQUILINO' | 'PROPIETARIO'
    city?: string
  }) {
    let supabaseQuery = supabase
      .from('User')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,about.ilike.%${query}%`)

    if (filters?.role) {
      supabaseQuery = supabaseQuery.eq('role', filters.role)
    }
    if (filters?.city) {
      supabaseQuery = supabaseQuery.eq('city', filters.city)
    }

    const { data, error } = await supabaseQuery
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data
  }

  static async searchProperties(query: string, filters?: {
    city?: string
    maxPrice?: number
    minPrice?: number
  }) {
    let supabaseQuery = supabase
      .from('Property')
      .select(`
        *,
        owner:User(id, name, email, image)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)

    if (filters?.city) {
      supabaseQuery = supabaseQuery.eq('city', filters.city)
    }
    if (filters?.maxPrice) {
      supabaseQuery = supabaseQuery.lte('priceMonthly', filters.maxPrice)
    }
    if (filters?.minPrice) {
      supabaseQuery = supabaseQuery.gte('priceMonthly', filters.minPrice)
    }

    const { data, error } = await supabaseQuery
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data
  }

  // Statistics for admin dashboard
  static async getStats() {
    const [usersResult, propertiesResult, matchesResult, blogsResult] = await Promise.all([
      supabase.from('User').select('id', { count: 'exact' }),
      supabase.from('Property').select('id', { count: 'exact' }),
      supabase.from('PropertyMatch').select('id', { count: 'exact' }),
      supabase.from('Blog').select('id', { count: 'exact' })
    ])

    return {
      users: usersResult.count || 0,
      properties: propertiesResult.count || 0,
      matches: matchesResult.count || 0,
      blogs: blogsResult.count || 0
    }
  }
}

// Legacy API for backward compatibility - Simplified mapping
export const api = {
  get: async (url: string) => {
    // Map old API endpoints to new ApiService methods
    if (url === '/users/me') {
      return { data: { user: null } }; // This will be handled by AuthService
    }
    if (url === '/properties') {
      const properties = await ApiService.getProperties();
      return { data: { properties } };
    }
    if (url === '/properties/mine') {
      // This needs current user ID - will be handled by components
      return { data: { properties: [] } };
    }
    if (url.startsWith('/matches/roommates/suggestions')) {
      // This needs current user ID - will be handled by components
      return { data: { suggestions: [] } };
    }
    if (url.startsWith('/matches/owner/properties/') && url.includes('/candidates')) {
      const propertyId = url.split('/')[4];
      // This needs current user ID - will be handled by components
      return { data: { candidates: [] } };
    }
    if (url === '/admin/api-keys') {
      // This needs current user ID - will be handled by components
      return { data: { keys: [] } };
    }
    if (url === '/users/admin/users') {
      const users = await ApiService.getUsers();
      return { data: { users } };
    }
    if (url === '/admin/metrics') {
       const stats = await ApiService.getStats();
       return { data: { propiedadesListadas: stats.properties || 0 } };
     }
    if (url === '/admin/blogs') {
      const blogs = await ApiService.getBlogs(false);
      return { data: { blogs } };
    }
    if (url === '/admin/smtp') {
      const smtp = await ApiService.getSmtpSettings();
      return { data: { smtp } };
    }
    throw new Error(`Legacy API endpoint not mapped: ${url}`);
  },
  
  post: async (url: string, data?: any) => {
    if (url === '/auth/logout') {
      return Promise.resolve(); // Handled by AuthService
    }
    if (url.startsWith('/matches/properties/') && url.includes('/interest')) {
      // This needs proper implementation with current user
      return { data: { success: true } };
    }
    if (url.startsWith('/matches/roommates/like/')) {
      // This needs proper implementation with current user
      return { data: { success: true } };
    }
    if (url === '/admin/api-keys') {
      // This needs proper implementation with current user
      return { data: { plaintext: 'mock-key-' + Date.now() } };
    }
    if (url === '/properties') {
      const property = await ApiService.createProperty(data);
      return { data: { property } };
    }
    if (url === '/admin/blogs') {
      const blog = await ApiService.createBlog(data);
      return { data: { blog } };
    }
    throw new Error(`Legacy API endpoint not mapped: ${url}`);
  },
  
  put: async (url: string, data?: any) => {
    if (url === '/admin/smtp') {
      await ApiService.updateSmtpSettings(data);
      return { data: { success: true } };
    }
    throw new Error(`Legacy API endpoint not mapped: ${url}`);
  },
  
  patch: async (url: string, data?: any) => {
    if (url === '/users/me') {
      // This needs current user ID - will be handled by components
      return { data: { user: data } };
    }
    throw new Error(`Legacy API endpoint not mapped: ${url}`);
  },
  
  delete: async (url: string) => {
    if (url.startsWith('/admin/api-keys/')) {
      const keyId = url.split('/')[3];
      await ApiService.deleteApiKey(keyId);
      return { data: { success: true } };
    }
    throw new Error(`Legacy API endpoint not mapped: ${url}`);
  }
};
