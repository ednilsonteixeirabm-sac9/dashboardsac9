/**
 * Formats API hour buckets without Date/timezone conversion.
 * Examples: 9 -> "09h", 18 -> "18h".
 */
export function formatDashboardHour(hora: number): string {
  return `${hora.toString().padStart(2, '0')}h`
}
