import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { authApi } from '../features/auth/auth.api'

interface AuthContextValue {
    user: User | null
    session: Session | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        void supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return
            setSession(data.session)
            setUser(data.session?.user ?? null)
            setLoading(false)
        })

        const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession)
            setUser(nextSession?.user ?? null)
            setLoading(false)
        })

        return () => {
            mounted = false
            data.subscription.unsubscribe()
        }
    }, [])

    const value = useMemo(
        () => ({
            user,
            session,
            loading,
            signIn: authApi.signInWithEmail,
            signUp: authApi.signUpWithEmail,
            signOut: authApi.signOut,
        }),
        [user, session, loading],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
