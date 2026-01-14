/**
 * Client environment variables (API Endpoint, Public API Key, etc.)
 */
import { clientEnvSchema } from './env.schema'

const parsed = clientEnvSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.log('Invalid environment variables', parsed.error.format())
  throw new Error('Invalid environment variables')
}

const env = parsed.data

export const CLIENT_ENV_CONFIG = {
  backendUrl: env.VITE_BACKEND_URL,
  backendApiUrl: env.VITE_BACKEND_API_URL,
  clerkPublishableKey: env.VITE_CLERK_PUBLISHABLE_KEY,
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}
