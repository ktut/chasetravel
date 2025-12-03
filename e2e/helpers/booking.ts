import { type Page, expect } from '@playwright/test'
import { openCalendarAndSelectDates } from './calendar'

/**
 * Tests the points redemption functionality on the confirmation page
 * @param page - Playwright page object
 * @param pointsAmount - Number of points to redeem
 * @returns Whether points redemption was tested (false if user not signed in)
 */
export async function testPointsRedemption(
  page: Page,
  pointsAmount: number
): Promise<boolean> {
  const redeemPointsOption = page.locator('.rewards-option').filter({ hasText: 'Redeem points' })
  const isDisabled = await redeemPointsOption.evaluate((el) => el.classList.contains('disabled'))
  
  if (!isDisabled) {
    // User is signed in, test points redemption
    await redeemPointsOption.click()
    
    // Verify points input appears
    await expect(page.locator('#pointsInput')).toBeVisible()
    
    // Enter points to redeem
    await page.locator('#pointsInput').fill(pointsAmount.toString())
    
    // Verify redemption summary
    await expect(page.locator('.redemption-summary')).toBeVisible()
    const formattedPoints = pointsAmount.toLocaleString()
    await expect(page.locator('.redemption-summary')).toContainText(formattedPoints)
    await expect(page.locator('.redemption-summary')).toContainText('Balance due')
    
    console.log('✓ Points redemption tested successfully')
    return true
  } else {
    console.log('✓ Points redemption disabled (user not signed in) - this is expected')
    return false
  }
}

/**
 * Completes a booking by clicking the book button and navigating to My Bookings
 * @param page - Playwright page object
 */
export async function completeBooking(page: Page): Promise<void> {
  // Click the book button
  await page.locator('.book-button').click()
  
  // Wait for booking to be created and navigation to My Bookings
  await page.waitForURL(/\/mybookings/, { timeout: 10000 })
  expect(page.url()).toContain('/mybookings')
  
  // Verify booking card is visible
  await page.waitForSelector('.booking-card', { timeout: 10000 })
  const bookingCard = page.locator('.booking-card').first()
  await expect(bookingCard).toBeVisible()
}

/**
 * Navigates to the booking detail page by clicking on the first booking card
 * @param page - Playwright page object
 */
export async function navigateToBookingDetail(page: Page): Promise<void> {
  // Click booking card to navigate to detail page
  const bookingCard = page.locator('.booking-card').first()
  await bookingCard.click()
  
  // Wait for navigation to booking detail page
  await page.waitForURL(/\/booking\/[a-f0-9-]+/, { timeout: 10000 })
  expect(page.url()).toMatch(/\/booking\/[a-f0-9-]+/)
  
  // Verify booking detail page loaded
  await page.waitForSelector('.booking-detail-content', { timeout: 10000 })
  await expect(page.locator('.booking-detail-content .page-title')).toContainText('My Booking')
}

/**
 * Reschedules a booking by selecting new dates
 * @param page - Playwright page object
 * @param newStartDayIndex - Zero-based index of the new start day
 * @param newEndDayIndex - Zero-based index of the new end day
 */
export async function rescheduleBooking(
  page: Page,
  newStartDayIndex: number,
  newEndDayIndex: number
): Promise<void> {
  // Capture original dates displayed on page
  const originalDatesHeader = await page.locator('.booking-dates-header').textContent()
  console.log('Original booking dates:', originalDatesHeader)
  
  // Verify Calendar component is visible on booking detail page
  await expect(page.locator('.reschedule-section .calendar')).toBeVisible()
  
  // Open calendar and select new dates
  await openCalendarAndSelectDates(page, newStartDayIndex, newEndDayIndex)
  
  // Verify "Confirm New Dates" button appears
  await expect(page.locator('.reschedule-actions')).toBeVisible()
  const confirmButton = page.locator('.reschedule-actions .btn-primary')
  await expect(confirmButton).toBeVisible()
  await expect(confirmButton).toContainText('Confirm New Dates')
  
  // Click "Confirm New Dates" button
  await confirmButton.click()
  
  // Wait for submission (2 second delay as per submitReschedule method)
  await page.waitForTimeout(2500)
  
  // Verify success notice appears
  await expect(page.locator('.success-notice')).toBeVisible()
  const successMessage = await page.locator('.success-notice .notice-content').textContent()
  expect(successMessage).toContain('date change request')
  expect(successMessage).toContain('third-party provider')
  
  // Verify dates have updated on the page
  const updatedDatesHeader = await page.locator('.booking-dates-header').textContent()
  console.log('Updated booking dates:', updatedDatesHeader)
  
  // Verify dates are different from original
  expect(updatedDatesHeader).not.toBe(originalDatesHeader)
  
  console.log('✓ Date change after booking verified successfully!')
}

/**
 * Verifies the standard booking sections on confirmation page
 * @param page - Playwright page object
 */
export async function verifyBookingSections(page: Page): Promise<void> {
  // Verify rewards redemption options
  await expect(page.locator('.rewards-option').filter({ hasText: 'Pay full amount' })).toBeVisible()
  await expect(page.locator('.rewards-option').filter({ hasText: 'Redeem points' })).toBeVisible()
  
  // Verify book button is present
  await expect(page.locator('.book-button')).toBeVisible()
  await expect(page.locator('.book-button')).toContainText('Book for')
}

