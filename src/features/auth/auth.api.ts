import { supabase } from '../../lib/supabase'

async function signInWithEmail(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
}

async function signUpWithEmail(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
}

async function signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
    })
    if (error) throw error
}

async function signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export const authApi = {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
}
