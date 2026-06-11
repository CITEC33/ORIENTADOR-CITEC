import { createClient } from '@supabase/supabase-js'
import { Capacitor } from '@capacitor/core'
import CapacitorStorage from './CapacitorStorage'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Variables de Supabase no configuradas')
  throw new Error('Configuración de Supabase incompleta')
}

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Capacitor.isNativePlatform() ? CapacitorStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: !Capacitor.isNativePlatform()
  }
})

export const supabase = customSupabaseClient

export default customSupabaseClient
