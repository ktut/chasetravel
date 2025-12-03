import { type Page, expect } from '@playwright/test'
import { expandSearchWidget } from '../helpers/search'
import { openCalendarAndSelectDates } from '../helpers/calendar'
import { waitForTransition, waitForWidgetMinimized } from '../helpers/wait'
import { SELECTORS, TIMEOUTS } from '../constants'

export class ResultsPage {
  constructor(private page: Page) {}

  /**
   * Selects the first flight from results and captures details
   * @returns Flight details (airline, departure airport, arrival airport)
   */
  async selectFirstFlight(): Promise<{ airline: string; departureAirport: string; arrivalAirport: string }> {
    // Wait for flight results to load
    await this.page.waitForSelector(SELECTORS.FLIGHT_CARD, { timeout: TIMEOUTS.ELEMENT_VISIBLE })
    
    // Get the first flight card
    const firstFlightCard = this.page.locator(SELECTORS.FLIGHT_CARD).first()
    await expect(firstFlightCard).toBeVisible()
    
    // Capture flight details for verification
    const airline = await firstFlightCard.locator('.airline-name').first().textContent()
    const route = await firstFlightCard.locator('.route').first().textContent()
    const [departureAirport, arrivalAirport] = (route || '').split('-')
    
    console.log('Selected flight:', { airline, departureAirport, arrivalAirport })
    
    // Click the select button
    await firstFlightCard.locator(SELECTORS.SELECT_BTN).click()
    
    return { airline: airline || '', departureAirport, arrivalAirport }
  }

  /**
   * Selects the first hotel from results and captures details
   * @returns Hotel details (name, rating)
   */
  async selectFirstHotel(): Promise<{ hotelName: string; hotelRating: string }> {
    // Wait for hotel results to load
    await this.page.waitForSelector(SELECTORS.HOTEL_CARD, { timeout: TIMEOUTS.ELEMENT_VISIBLE })
    
    // Get the first hotel card
    const firstHotelCard = this.page.locator(SELECTORS.HOTEL_CARD).first()
    await expect(firstHotelCard).toBeVisible()
    
    // Capture hotel details for verification
    const hotelName = await firstHotelCard.locator('.hotel-name').textContent()
    const hotelRating = await firstHotelCard.locator('.rating-score').textContent()
    
    console.log('Selected hotel:', { hotelName, hotelRating })
    
    // Click the select button
    await firstHotelCard.locator(SELECTORS.SELECT_BTN).first().click()
    
    return { hotelName: hotelName || '', hotelRating: hotelRating || '' }
  }

  /**
   * Updates search dates on the results page
   * @param startDayIndex - Zero-based index for new start date
   * @param endDayIndex - Zero-based index for new end date
   * @returns Initial and updated URL for verification
   */
  async updateSearchDates(
    startDayIndex: number,
    endDayIndex: number
  ): Promise<{ initialUrl: string; updatedUrl: string }> {
    // Capture initial URL
    const initialUrl = this.page.url()
    console.log('Initial URL:', initialUrl)
    
    // Expand search widget if minimized
    await expandSearchWidget(this.page)
    
    // Verify Update button is initially visible
    const updateButton = this.page.locator(SELECTORS.SUBMIT_BTN).first()
    await expect(updateButton).toBeVisible({ timeout: TIMEOUTS.CALENDAR_VISIBLE })
    
    // Change dates
    await openCalendarAndSelectDates(this.page, startDayIndex, endDayIndex)
    
    // Verify Update button is now enabled
    const nowEnabled = await updateButton.isEnabled()
    console.log('Update button now enabled:', nowEnabled)
    expect(nowEnabled).toBe(true)
    
    // Click the Update button
    await updateButton.click()
    
    // Wait for URL to update
    await waitForTransition(this.page)
    const updatedUrl = this.page.url()
    console.log('Updated URL:', updatedUrl)
    
    return { initialUrl, updatedUrl }
  }

  /**
   * Verifies URL parameters have changed after update
   * @param initialUrl - Initial URL before update
   * @param updatedUrl - Updated URL after update
   */
  verifyUrlChanged(initialUrl: string, updatedUrl: string): void {
    expect(updatedUrl).not.toBe(initialUrl)
    
    // Extract and verify date parameters have changed
    const initialUrlParams = new URLSearchParams(initialUrl.split('?')[1])
    const updatedUrlParams = new URLSearchParams(updatedUrl.split('?')[1])
    
    const initialCheckIn = initialUrlParams.get('checkIn')
    const initialCheckOut = initialUrlParams.get('checkOut')
    const updatedCheckIn = updatedUrlParams.get('checkIn')
    const updatedCheckOut = updatedUrlParams.get('checkOut')
    
    console.log('Initial dates:', { checkIn: initialCheckIn, checkOut: initialCheckOut })
    console.log('Updated dates:', { checkIn: updatedCheckIn, checkOut: updatedCheckOut })
    
    // Verify dates have changed
    expect(updatedCheckIn).not.toBe(initialCheckIn)
    expect(updatedCheckOut).not.toBe(initialCheckOut)
    
    // Verify the dates are valid future dates (in format YYYY-MM-DD)
    expect(updatedCheckIn).toMatch(/\d{4}-\d{2}-\d{2}/)
    expect(updatedCheckOut).toMatch(/\d{4}-\d{2}-\d{2}/)
    
    // Verify checkout is after checkin
    const checkInDate = new Date(updatedCheckIn!)
    const checkOutDate = new Date(updatedCheckOut!)
    expect(checkOutDate.getTime()).toBeGreaterThan(checkInDate.getTime())
  }

  /**
   * Verifies the widget is minimized after update
   */
  async verifyWidgetMinimized(): Promise<void> {
    await waitForWidgetMinimized(this.page)
  }
}

