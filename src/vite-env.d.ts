/// <reference types="vite/client" />

// ===========================================
// Client-side environment variables
// Accessible via import.meta.env.VITE_*
// ===========================================
interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_BACKEND_API_URL: string
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  // Built-in Vite env variables
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// ===========================================
// Server-side environment variables
// Accessible via process.env.* in server functions
// ===========================================
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DATABASE_URL: string
      readonly CLERK_SECRET_KEY: string
      readonly NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}

export {}
