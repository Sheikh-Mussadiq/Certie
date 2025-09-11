import { clsx } from 'clsx';

/**
 * Combines multiple class names into a single string
 * This utility is used by shadcn components
 */
export function cn(...inputs) {
  return clsx(inputs);
}
