"use client";

import { useTheme } from "next-themes";
import { OpenaiDark } from "./openaiDark";
import { OpenaiLight } from "./openaiLight";

export const Openai = ({ className }: { className?: string }) => {
  const { resolvedTheme } = useTheme();

  if (resolvedTheme === "dark") {
    return <OpenaiDark className={className} />;
  }

  return <OpenaiLight className={className} />;
};
