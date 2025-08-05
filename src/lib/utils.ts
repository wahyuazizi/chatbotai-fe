import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Custom type guard for AxiosError
interface AxiosError extends Error {
  response?: {
    data?: any;
    status?: number;
    headers?: Record<string, any>;
  };
  request?: any;
  config?: Record<string, any>;
  isAxiosError: boolean;
  toJSON: () => object;
}

export function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}