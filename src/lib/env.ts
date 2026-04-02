const missing = (['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const).filter(
    (key) => !import.meta.env[key],
)

if (missing.length > 0) {
    console.error(
        `[Loomsby] Missing env vars: ${missing.join(', ')}. ` +
            'Copy .env.example to .env and fill in your Supabase credentials.',
    )
}

export const env = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
} as const
