import clsx, { type ClassValue } from "clsx";

/** Tiny class-name joiner. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
