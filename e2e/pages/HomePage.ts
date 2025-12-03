import { type Page } from '@playwright/test'
import { fillLocationInput, selectSearchType, submitSearch, waitForSearchResults } from '../helpers/search'
import { openCalendarAndSelectDates } from '../helpers/calendar'
import { TIMEOUTS } from '../constants'

export class HomePage {
  constructor(private page: Page) {}

  /**
   * Navigates to the homepage
   */
  async goto(): Promise<void> {
    await this.page.goto('/', { timeout: TIMEOUTS.PAGE_LOAD })
  }

  /**
   * Performs a complete flight search
   * @param from - Departure location
   * @param to - Destination location
   * @param startDayIndex - Zero-based index for start date
   * @param endDayIndex - Zero-based index for end date
   */
  async searchFlights(
    from: string,
    to: string,
    startDayIndex: number,
    endDayIndex: number
  ): Promise<void> {
    // Flights are selected by default, no need to switch
    
    // Fill location inputs
    await fillLocationInput(this.page, from, false)
    await fillLocationInput(this.page, to, true)
    
    // Select dates
    await openCalendarAndSelectDates(this.page, startDayIndex, endDayIndex)
    
    // Submit search
    await submitSearch(this.page)
    
    // Wait for results
    await waitForSearchResults(this.page, 'flights')
  }

  /**
   * Performs a complete hotel search
   * @param location - Location for hotel search
   * @param checkInDayIndex - Zero-based index for check-in date
   * @param checkOutDayIndex - Zero-based index for check-out date
   */
  async searchHotels(
    location: string,
    checkInDayIndex: number,
    checkOutDayIndex: number
  ): Promise<void> {
    // Switch to Stays (Hotels) search
    await selectSearchType(this.page, 'stays')
    
    // Fill location input
    await fillLocationInput(this.page, location, false)
    
    // Select dates
    await openCalendarAndSelectDates(this.page, checkInDayIndex, checkOutDayIndex)
    
    // Submit search
    await submitSearch(this.page)
    
    // Wait for results
    await waitForSearchResults(this.page, 'hotels')
  }
}

