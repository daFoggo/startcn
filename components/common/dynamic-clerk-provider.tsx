"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useMemo } from "react";

export function DynamicClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();

  const theme = useMemo(() => {
    return resolvedTheme === "dark" ? dark : undefined;
  }, [resolvedTheme]);

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
