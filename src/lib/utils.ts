import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dice() {
  return Math.floor(Math.random() * 6) + 1;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
