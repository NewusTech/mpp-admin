import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
