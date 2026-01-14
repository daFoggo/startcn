/**
 * Server environment variables (API Key, DB URL, etc.)
 */
import { serverEnvSchema } from './env.schema'

const parsed = serverEnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.log('Invalid environment variables', parsed.error.format())
  throw new Error('Invalid environment variables')
}

const env = parsed.data

export const SERVER_ENV_CONFIG = {
  databaseUrl: env.DATABASE_URL,
  clerkSecretKey: env.CLERK_SECRET_KEY,
  nodeEnv: env.NODE_ENV,
}
