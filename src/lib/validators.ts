import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((input) => input.password === input.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  })

export const postSchema = z.object({
  title: z.string().min(2).max(120),
  content_md: z.string().min(1).max(5000),
})

export const commentSchema = z.object({
  content_md: z.string().min(1).max(1000),
})

export const messageSchema = z.object({
  content: z.string().min(1).max(1000),
})
