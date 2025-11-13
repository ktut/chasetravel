/**
 * Flight price category
 * @typedef {'cheap' | 'normal' | 'expensive'} PriceCategory
 */

/**
 * US Federal Holidays for 2025-2026
 */
const US_HOLIDAYS = [
  '2025-01-01', // New Year's Day
  '2025-01-20', // Martin Luther King Jr. Day
  '2025-02-17', // Presidents' Day
  '2025-05-26', // Memorial Day
  '2025-07-04', // Independence Day
  '2025-09-01', // Labor Day
  '2025-10-13', // Columbus Day
  '2025-11-11', // Veterans Day
  '2025-11-27', // Thanksgiving
  '2025-12-25', // Christmas Day
  '2026-01-01', // New Year's Day
  '2026-01-19', // Martin Luther King Jr. Day
  '2026-02-16', // Presidents' Day
  '2026-05-25', // Memorial Day
  '2026-07-04', // Independence Day
  '2026-09-07', // Labor Day
  '2026-10-12', // Columbus Day
  '2026-11-11', // Veterans Day
  '2026-11-26', // Thanksgiving
  '2026-12-25'  // Christmas Day
]

/**
 * Convert holiday strings to Date objects for faster comparison
 */
const HOLIDAY_DATES = US_HOLIDAYS.map(dateStr => new Date(dateStr))

/**
 * Number of days before and after a holiday that are considered expensive
 */
const HOLIDAY_BUFFER_DAYS = 4

/**
 * Check if a date is within the holiday buffer period
 * @param {Date} date - The date to check
 * @returns {boolean}
 */
function isNearHoliday(date) {
  const dateTime = date.getTime()
  const oneDayMs = 1000 * 60 * 60 * 24

  for (const holiday of HOLIDAY_DATES) {
    const holidayTime = holiday.getTime()
    const daysDiff = Math.abs((dateTime - holidayTime) / oneDayMs)

    if (daysDiff <= HOLIDAY_BUFFER_DAYS) {
      return true
    }
  }

  return false
}

/**
 * Check if a date is a weekend
 * @param {Date} date - The date to check
 * @returns {boolean}
 */
function isWeekend(date) {
  const dayOfWeek = date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

/**
 * Get the flight price category for a given date
 * @param {Date} date - The date to check
 * @returns {PriceCategory} - 'cheap', 'normal', or 'expensive'
 */
export function getDayValueCategory(date) {
  // Check if date is a holiday or within buffer period
  if (isNearHoliday(date)) {
    return 'expensive'
  }

  // Check if date is a weekend
  if (isWeekend(date)) {
    return 'normal'
  }

  // Weekday
  return 'cheap'
}

/**
 * Get the flight price categories for multiple dates (batch processing)
 * More performant when checking many dates at once
 * @param {Date[]} dates - Array of dates to check
 * @returns {Map<string, PriceCategory>} - Map of ISO date strings to price categories
 */
export function getDayValueCategories(dates) {
  const result = new Map()

  for (const date of dates) {
    const isoString = date.toISOString().split('T')[0]
    result.set(isoString, getDayValueCategory(date))
  }

  return result
}

export default getDayValueCategory
