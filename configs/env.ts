export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const APP_ENV =
  process.env.ENV ?? process.env.NEXT_PUBLIC_APP_ENV ?? "development";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const BACKEND_IP = process.env.NEXT_PUBLIC_BACKEND_IP;
export const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

export const isLocal = NODE_ENV === "development";
export const isDev = APP_ENV === "development";
export const isProd = APP_ENV === "production";
