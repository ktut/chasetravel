/**
 * Date calculation and validation utilities
 */

/**
 * Calculates the number of nights between two dates
 * @param checkIn - Check-in date (Date object or date string)
 * @param checkOut - Check-out date (Date object or date string)
 * @returns Number of nights (minimum 1)
 */
export function calculateNights(checkIn: Date | string, checkOut: Date | string): number {
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays || 1
}

/**
 * Validates that check-out date is after check-in date
 * @param checkIn - Check-in date
 * @param checkOut - Check-out date
 * @returns True if valid, false otherwise
 */
export function validateDateRange(checkIn: Date | string, checkOut: Date | string): boolean {
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut
  return checkOutDate > checkInDate
}

/**
 * Checks if a date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dateObj.setHours(0, 0, 0, 0)
  return dateObj < today
}

