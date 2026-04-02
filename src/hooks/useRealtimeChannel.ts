import { useEffect } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useRealtimeChannel(build: () => RealtimeChannel, deps: ReadonlyArray<unknown>) {
    useEffect(() => {
        const channel = build()
        channel.subscribe()

        return () => {
            void supabase.removeChannel(channel)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}
