/**
 * Formats an amount in Indian Rupees (INR) using Indian numbering system (Lakhs / Crores)
 * e.g. 150000 -> ₹1,50,000
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Common traditional auspicious Shagun denominations ending in +1
 */
export const AUSPICIOUS_AMOUNTS = [
  { value: 501, label: '₹501', meaning: 'Shubh Shagun' },
  { value: 1100, label: '₹1,100', meaning: 'Ashirwad' },
  { value: 2100, label: '₹2,100', meaning: 'Mangal Shagun' },
  { value: 5100, label: '₹5,100', meaning: 'Vishesh Ashirwad' },
  { value: 11000, label: '₹11,000', meaning: 'Anant Ashirwad' },
];

/**
 * Checks if a given number ends in 1 (traditional shagun practice)
 */
export function isAuspiciousAmount(amount: number): boolean {
  return amount % 10 === 1;
}

