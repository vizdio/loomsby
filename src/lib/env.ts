const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const

for (const key of required) {
  if (!import.meta.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const
