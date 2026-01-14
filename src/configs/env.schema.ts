/**
 * Environment variables schema
 * Always add fields to the schemas whenever you want to add new environment variables
 */
import { z } from 'zod'

export const clientEnvSchema = z.object({
  VITE_BACKEND_URL: z.string().url(),
  VITE_BACKEND_API_URL: z.string().url(),
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),
})

export const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})
