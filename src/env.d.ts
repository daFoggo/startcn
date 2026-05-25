/// <reference types="vite/client" />

interface ImportMetaEnv {
	// Client-side environment variables (prefixed with VITE_)
	readonly VITE_APP_NAME: string;
	readonly VITE_API_CORE_URL: string;
	readonly VITE_API_AI_URL: string;
	readonly VITE_SELINE_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

// Server-side environment variables
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly DATABASE_URL: string;
			readonly OPEN_AI_API_KEY: string;
			readonly SELINE_TOKEN: string;
			readonly NODE_ENV: "development" | "production" | "test";
		}
	}
}

export {};
