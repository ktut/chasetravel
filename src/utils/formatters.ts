/**
 * Shared formatting utilities for the application
 */

/**
 * Formats a price as USD currency
 * @param price - The price to format
 * @returns Formatted price string (e.g., "$123")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

/**
 * Formats a date with weekday, month, day, and year
 * @param date - Date object or date string
 * @returns Formatted date string (e.g., "Mon, Jan 15, 2024")
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Formats a date with just month and day
 * @param date - Date object or date string
 * @returns Formatted date string (e.g., "Jan 15")
 */
export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Formats a date with full weekday, month, day, and year
 * @param dateString - Date string
 * @returns Formatted date string (e.g., "Monday, January 15, 2024")
 */
export function formatDateHeader(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Formats a time from 24-hour format to 12-hour format
 * @param time - Time string in 24-hour format (e.g., "14:30")
 * @returns Formatted time string (e.g., "2:30 pm")
 */
export function formatTime(time: string): string {
  // Convert 24hr time to 12hr format (e.g., "14:30" -> "2:30 pm")
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const period = hour >= 12 ? 'pm' : 'am'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${period}`
}

/**
 * Formats a date in MM/DD/YY format
 * @param date - Date object
 * @returns Formatted date string (e.g., "01/15/24")
 */
export function formatDateShort(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${month}/${day}/${year}`
}

