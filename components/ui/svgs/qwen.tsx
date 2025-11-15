"use client";

import { useTheme } from "next-themes";
import { QwenDark } from "./qwenDark";
import { QwenLight } from "./qwenLight";

export const Qwen = ({ className }: { className?: string }) => {
  const { resolvedTheme } = useTheme();

  if (resolvedTheme === "dark") {
    return <QwenDark className={className} />;
  }

  return <QwenLight className={className} />;
};
