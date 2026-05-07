import { clsx } from 'clsx';

/**
 * Merge class names conditionally.
 * Thin wrapper around clsx — extend with tailwind-merge if needed.
 */
export function cn(...inputs) {
  return clsx(inputs);
}
