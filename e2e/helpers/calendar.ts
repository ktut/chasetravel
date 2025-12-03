import { type Page } from '@playwright/test'

/**
 * Opens the calendar picker by clicking on the first date input
 */
export async function openCalendar(page: Page): Promise<void> {
  await page.locator('.date-input').first().click()
  await waitForCalendarVisible(page)
}

/**
 * Waits for the desktop calendar to be visible and stable
 */
export async function waitForCalendarVisible(page: Page): Promise<void> {
  await page.locator('.desktop-calendar').waitFor({ state: 'visible', timeout: 5000 })
  // Small wait for calendar to stabilize after opening
  await page.waitForTimeout(500)
}

/**
 * Selects a date range by clicking on the start and end day indices
 * @param page - Playwright page object
 * @param startDayIndex - Zero-based index of the start day (e.g., 0 = 1st available day)
 * @param endDayIndex - Zero-based index of the end day (e.g., 3 = 4th available day)
 */
export async function selectDateRange(
  page: Page,
  startDayIndex: number,
  endDayIndex: number
): Promise<void> {
  // Get all available days (not past dates, not other month)
  const availableDays = page.locator('.desktop-calendar .day:not(.past-date):not(.other-month)')
  
  // Select start date
  const startDay = availableDays.nth(startDayIndex)
  await startDay.waitFor({ state: 'visible', timeout: 5000 })
  await startDay.click()
  
  // For round-trip/hotel bookings, select end date
  if (endDayIndex !== startDayIndex) {
    // Wait for start date selection to complete
    await page.waitForSelector('.desktop-calendar .day.selected', { timeout: 5000 })
    await page.waitForTimeout(500)
    
    // Ensure calendar is still open
    await page.locator('.desktop-calendar').waitFor({ state: 'visible', timeout: 5000 })
    
    // Re-query available days to get fresh DOM references after potential re-render
    const allAvailableDays = page.locator('.desktop-calendar .day:not(.past-date):not(.other-month)')
    const endDay = allAvailableDays.nth(endDayIndex)
    
    await endDay.waitFor({ state: 'visible', timeout: 5000 })
    await page.locator('.desktop-calendar').scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    
    // Try clicking normally first, but use force if there are pointer event issues
    try {
      await endDay.click({ timeout: 5000 })
    } catch (error) {
      console.log('Normal click failed, trying force click')
      await endDay.click({ force: true, timeout: 5000 })
    }
  }
  
  // Calendar should auto-close after selecting end date
  await page.waitForTimeout(500)
}

/**
 * Opens calendar and selects a date range in one operation
 * @param page - Playwright page object
 * @param startDayIndex - Zero-based index of the start day
 * @param endDayIndex - Zero-based index of the end day
 */
export async function openCalendarAndSelectDates(
  page: Page,
  startDayIndex: number,
  endDayIndex: number
): Promise<void> {
  await openCalendar(page)
  await selectDateRange(page, startDayIndex, endDayIndex)
}

