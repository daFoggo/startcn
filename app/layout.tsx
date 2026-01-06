import { TooltipProvider } from "@/components/animate-ui/components/animate/tooltip";
import { ThemeProvider } from "@/components/common/theme-provider";
import { DynamicClerkProvider } from "@/components/common/dynamic-clerk-provider";

import "@clerk/themes/shadcn.css";
import type { Metadata } from "next";
import { Google_Sans, Google_Sans_Code } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
});

const googleSansCode = Google_Sans_Code({
  variable: "--font-google-sans-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "startcn",
  description:
    "A Next.js shadcn/ui base project for kickstarting your next web application with a modern tech stack, beautiful components, and developer-friendly setup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${googleSans.variable} ${googleSansCode.variable} antialiased`}
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DynamicClerkProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </DynamicClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
