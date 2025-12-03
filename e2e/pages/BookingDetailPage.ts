import { type Page, expect } from '@playwright/test'
import { rescheduleBooking } from '../helpers/booking'
import { waitForNavigation } from '../helpers/wait'
import { SELECTORS, TIMEOUTS, URL_PATTERNS } from '../constants'

export class BookingDetailPage {
  constructor(private page: Page) {}

  /**
   * Navigates to booking detail by clicking on the first booking card
   */
  async navigateFromBookingsList(): Promise<void> {
    // Click booking card to navigate to detail page
    const bookingCard = this.page.locator(SELECTORS.BOOKING_CARD).first()
    await bookingCard.click()
    
    // Wait for navigation to booking detail page
    await waitForNavigation(this.page, URL_PATTERNS.BOOKING_DETAIL)
    
    // Verify booking detail page loaded
    await this.page.waitForSelector(SELECTORS.BOOKING_DETAIL_CONTENT, { timeout: TIMEOUTS.ELEMENT_VISIBLE })
    await expect(this.page.locator('.booking-detail-content .page-title')).toContainText('My Booking')
  }

  /**
   * Reschedules booking dates
   * @param newStartDayIndex - Zero-based index for new start date
   * @param newEndDayIndex - Zero-based index for new end date
   */
  async rescheduleDates(newStartDayIndex: number, newEndDayIndex: number): Promise<void> {
    await rescheduleBooking(this.page, newStartDayIndex, newEndDayIndex)
  }
}

