import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCompactNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }
  return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}