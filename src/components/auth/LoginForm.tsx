import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { loginSchema } from '../../lib/validators'
import { useAuth } from '../../hooks/useAuth'
import { authApi } from '../../features/auth/auth.api'

type LoginInput = z.infer<typeof loginSchema>

export function LoginForm() {
  const { signIn } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const submit = handleSubmit(async (values) => {
    setError(null)
    try {
      await signIn(values.email, values.password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  })

  return (
    <form className="card stack" onSubmit={submit}>
      <h2>Login</h2>
      <label>
        Email
        <input type="email" autoComplete="email" {...register('email')} />
      </label>
      <label>
        Password
        <input type="password" autoComplete="current-password" {...register('password')} />
      </label>
      {formState.errors.email && <p className="error">{formState.errors.email.message}</p>}
      {formState.errors.password && <p className="error">{formState.errors.password.message}</p>}
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={formState.isSubmitting}>Sign in</button>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => {
          void authApi.signInWithGoogle().catch((err: unknown) => {
            setError(err instanceof Error ? err.message : 'OAuth failed')
          })
        }}
      >
        Continue with Google
      </button>
    </form>
  )
}
