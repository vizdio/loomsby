import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { signupSchema } from '../../lib/validators'
import { useAuth } from '../../hooks/useAuth'

type SignupInput = z.infer<typeof signupSchema>

export function SignupForm() {
  const { signUp } = useAuth()
  const [message, setMessage] = useState<string | null>(null)

  const { register, handleSubmit, formState } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const submit = handleSubmit(async (values) => {
    setMessage(null)
    try {
      await signUp(values.email, values.password)
      setMessage('Account created. Check your email for the confirmation link.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Signup failed')
    }
  })

  return (
    <form className="card stack" onSubmit={submit}>
      <h2>Sign up</h2>
      <label>
        Email
        <input type="email" autoComplete="email" {...register('email')} />
      </label>
      <label>
        Password
        <input type="password" autoComplete="new-password" {...register('password')} />
      </label>
      <label>
        Confirm password
        <input type="password" autoComplete="new-password" {...register('confirmPassword')} />
      </label>
      {formState.errors.email && <p className="error">{formState.errors.email.message}</p>}
      {formState.errors.password && <p className="error">{formState.errors.password.message}</p>}
      {formState.errors.confirmPassword && <p className="error">{formState.errors.confirmPassword.message}</p>}
      {message && <p className="notice">{message}</p>}
      <button type="submit" disabled={formState.isSubmitting}>Create account</button>
    </form>
  )
}
