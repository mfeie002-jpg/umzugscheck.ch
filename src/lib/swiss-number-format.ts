/**
 * Swiss Number Formatting Utilities
 * Uses Swiss standard: 1'000 (apostrophe as thousands separator)
 * Decimal: 1'234,56 (comma for decimals)
 */

/**
 * Format a number using Swiss conventions
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with Swiss apostrophe separators
 */
export function formatSwissNumber(num: number, decimals: number = 0): string {
  const parts = num.toFixed(decimals).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  
  if (decimals > 0 && parts[1]) {
    return `${integerPart},${parts[1]}`;
  }
  
  return integerPart;
}

/**
 * Format currency in Swiss CHF format
 * @param amount - The amount to format
 * @param showSymbol - Whether to show CHF symbol (default: true)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted currency string
 */
export function formatSwissCHF(amount: number, showSymbol: boolean = true, decimals: number = 0): string {
  const formatted = formatSwissNumber(amount, decimals);
  return showSymbol ? `${formatted} CHF` : formatted;
}

/**
 * Format percentage in Swiss format
 * @param value - The percentage value
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatSwissPercent(value: number, decimals: number = 0): string {
  return `${formatSwissNumber(value, decimals)}%`;
}

/**
 * Format large numbers with K, Mio, Mrd suffixes (Swiss style)
 * @param num - The number to format
 * @returns Formatted string with appropriate suffix
 */
export function formatSwissCompact(num: number): string {
  if (num >= 1_000_000_000) {
    return `${formatSwissNumber(num / 1_000_000_000, 1)} Mrd`;
  }
  if (num >= 1_000_000) {
    return `${formatSwissNumber(num / 1_000_000, 1)} Mio`;
  }
  if (num >= 1_000) {
    return `${formatSwissNumber(num / 1_000, 0)}'000`;
  }
  return formatSwissNumber(num);
}

/**
 * Parse a Swiss-formatted number string back to a number
 * @param str - The Swiss-formatted string
 * @returns The parsed number
 */
export function parseSwissNumber(str: string): number {
  // Remove apostrophes and replace comma with dot
  const normalized = str.replace(/'/g, '').replace(',', '.');
  return parseFloat(normalized);
}

// Common formatted values used across the app
export const SWISS_NUMBERS = {
  // Market stats
  MOVES_PER_YEAR: "450'000",
  TAM: "4,5 Mrd",
  SAM: "675 Mio",
  
  // Unit economics
  REVENUE_PER_CUSTOMER: "553",
  COST_PER_CUSTOMER: "50",
  PROFIT_PER_CUSTOMER: "503",
  MARGIN: "91%",
  
  // Development stats
  DEV_HOURS: "2'100+",
  COMPONENTS: "1'000+",
  PAGES: "150+",
  TABLES: "60+",
  
  // Business projections
  CONSERVATIVE_ORDERS: "1'125",
  REALISTIC_ORDERS: "2'250",
  AMBITIOUS_ORDERS: "4'500",
} as const;
