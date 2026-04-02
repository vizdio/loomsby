import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMemo, type ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
