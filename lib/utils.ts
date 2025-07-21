import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Shortens a blockchain address for display purposes
 * @param address The full address to shorten
 * @param chars Number of characters to keep at the beginning and end
 * @returns Shortened address with ellipsis in the middle
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  
  // For Starknet addresses which might be prefixed with 0x
  const prefix = address.startsWith('0x') ? '0x' : '';
  const addressWithoutPrefix = address.startsWith('0x') ? address.slice(2) : address;
  
  if (addressWithoutPrefix.length <= chars * 2) return address;
  
  return `${prefix}${addressWithoutPrefix.slice(0, chars)}...${addressWithoutPrefix.slice(-chars)}`;
}