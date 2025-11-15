"use client";

import { useTheme } from "next-themes";
import { QwenDark } from "./qwenDark";
import { QwenLight } from "./qwenLight";

export const Qwen = ({ className }: { className?: string }) => {
  const { theme } = useTheme();

  if (theme === "dark") {
    return <QwenDark className={className} />;
  }

  return <QwenLight className={className} />;
};
