const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/**
 * "2020-03-08" → "8 March 2020", "2024-11" → "November 2024".
 * Written by hand rather than with Intl so server and client output is
 * byte-identical regardless of the build machine's ICU data or locale.
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  const monthName = MONTHS[Number(month) - 1];
  if (!year || !monthName) throw new Error(`Unparseable date "${iso}"`);
  return day ? `${Number(day)} ${monthName} ${year}` : `${monthName} ${year}`;
}

/** "2024-11" → "Nov 2024" */
export function formatMonth(iso: string): string {
  return formatDate(iso).replace(/^(\w{3})\w*/, '$1');
}
