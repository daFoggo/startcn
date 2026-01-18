/**
 * Environment Variables Schema
 * ============================
 * Define validation schemas for all environment variables.
 * Always add fields here when adding new environment variables.
 */
import { z } from 'zod'

export const clientEnvSchema = z.object({
  VITE_BACKEND_URL: z.string().url({
    message: 'VITE_BACKEND_URL must be a valid URL',
  }),
  VITE_BACKEND_API_URL: z.string().url({
    message: 'VITE_BACKEND_API_URL must be a valid URL',
  }),
  VITE_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, 'VITE_CLERK_PUBLISHABLE_KEY is required')
    .startsWith('pk_', 'VITE_CLERK_PUBLISHABLE_KEY should start with pk_'),
})

export const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .refine(
      (url) =>
        url.startsWith('postgresql://') ||
        url.startsWith('postgres://') ||
        url.startsWith('mysql://'),
      'DATABASE_URL must be a valid database connection string',
    ),
  CLERK_SECRET_KEY: z
    .string()
    .min(1, 'CLERK_SECRET_KEY is required')
    .startsWith('sk_', 'CLERK_SECRET_KEY should start with sk_'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
})

export type ClientEnv = z.infer<typeof clientEnvSchema>
export type ServerEnv = z.infer<typeof serverEnvSchema>
