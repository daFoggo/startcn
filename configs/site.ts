import { isDev } from "./env";

export const SITE_CONFIG = {
  name: "startcn",
  title: "startcn - A Next.js shadcn/ui starter template",
  description:
    "A Next.js shadcn/ui base project for kickstarting your next web application with a modern tech stack, beautiful components, and developer-friendly setup.",
  domain: "startcn.vercel.app",
  url: isDev ? "http://localhost:3000" : "https://startcn.vercel.app",
  github: {
    name: "startcn",
    repo: "startcn",
    url: "https://github.com/daFoggo/startcn",
  },
  author: {
    name: "daFoggo",
    url: "https://github.com/daFoggo",
  },
};

export type ISiteConfig = typeof SITE_CONFIG;
