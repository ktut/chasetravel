import { type Page, expect } from '@playwright/test'
import { testPointsRedemption, verifyBookingSections } from '../helpers/booking'
import { waitForNavigation } from '../helpers/wait'
import { SELECTORS, TIMEOUTS, URL_PATTERNS } from '../constants'

export class ConfirmationPage {
  constructor(private page: Page) {}

  /**
   * Waits for the confirmation page to load
   */
  async waitForLoad(): Promise<void> {
    await waitForNavigation(this.page, URL_PATTERNS.CONFIRMATION)
    await this.page.waitForSelector(SELECTORS.CONFIRMATION_PAGE, { timeout: TIMEOUTS.ELEMENT_VISIBLE })
  }

  /**
   * Verifies flight details on confirmation page
   * @param expectedAirline - Expected airline name
   * @param expectedDepartureAirport - Expected departure airport code
   * @param expectedArrivalAirport - Expected arrival airport code
   */
  async verifyFlightDetails(
    expectedAirline: string,
    expectedDepartureAirport: string,
    expectedArrivalAirport: string
  ): Promise<void> {
    const confirmationPage = this.page.locator(SELECTORS.CONFIRMATION_PAGE)
    
    // Verify airline name
    await expect(confirmationPage.locator('.airline-name').first()).toContainText(expectedAirline)
    
    // Verify departure and arrival airports (check first flight leg for outbound flight)
    const firstFlightLeg = this.page.locator('.flight-leg').first()
    const confDepartureAirport = await firstFlightLeg.locator('.leg-details .time-point').first().locator('.airport').textContent()
    const confArrivalAirport = await firstFlightLeg.locator('.leg-details .time-point').last().locator('.airport').textContent()
    
    expect(confDepartureAirport?.trim()).toBe(expectedDepartureAirport?.trim())
    expect(confArrivalAirport?.trim()).toBe(expectedArrivalAirport?.trim())
    
    console.log('✓ Flight details verified')
  }

  /**
   * Verifies fare selection on confirmation page
   */
  async verifyFareSelection(): Promise<void> {
    await expect(this.page.locator('.fare-card h3').first()).toContainText('Basic Economy')
  }

  /**
   * Verifies hotel details on confirmation page
   * @param expectedName - Expected hotel name
   * @param expectedRating - Expected hotel rating
   */
  async verifyHotelDetails(expectedName: string, expectedRating: string): Promise<void> {
    // Wait for hotel details section
    await this.page.waitForSelector('.hotel-details-section', { timeout: TIMEOUTS.ELEMENT_VISIBLE })
    
    // Verify hotel name
    await expect(this.page.locator('.hotel-info h3')).toContainText(expectedName)
    
    // Verify rating matches
    const confHotelRating = await this.page.locator('.hotel-info .rating-score').textContent()
    expect(confHotelRating?.trim()).toBe(expectedRating?.trim())
    
    console.log('✓ Hotel details verified')
  }

  /**
   * Verifies hotel stay information is present
   */
  async verifyHotelStayInfo(): Promise<void> {
    await expect(this.page.locator('.hotel-stay-info')).toBeVisible()
    
    const stayDetails = this.page.locator('.stay-detail')
    await expect(stayDetails.filter({ hasText: 'Check-in:' })).toBeVisible()
    await expect(stayDetails.filter({ hasText: 'Check-out:' })).toBeVisible()
    await expect(stayDetails.filter({ hasText: 'night' }).first()).toBeVisible()
    await expect(stayDetails.filter({ hasText: 'Price per night:' })).toBeVisible()
    
    console.log('✓ Hotel stay information verified')
  }

  /**
   * Verifies all standard booking sections
   */
  async verifyBookingSections(): Promise<void> {
    await verifyBookingSections(this.page)
  }

  /**
   * Tests points redemption functionality
   * @param pointsAmount - Number of points to redeem
   * @returns Whether points redemption was tested
   */
  async testPointsRedemption(pointsAmount: number): Promise<boolean> {
    return await testPointsRedemption(this.page, pointsAmount)
  }

  /**
   * Completes the booking by clicking the book button
   */
  async completeBooking(): Promise<void> {
    await this.page.locator(SELECTORS.BOOK_BUTTON).click()
    
    // Wait for booking to be created and navigation to My Bookings
    await waitForNavigation(this.page, URL_PATTERNS.MY_BOOKINGS)
    
    // Verify booking card is visible
    await this.page.waitForSelector(SELECTORS.BOOKING_CARD, { timeout: TIMEOUTS.ELEMENT_VISIBLE })
    const bookingCard = this.page.locator(SELECTORS.BOOKING_CARD).first()
    await expect(bookingCard).toBeVisible()
  }
}

