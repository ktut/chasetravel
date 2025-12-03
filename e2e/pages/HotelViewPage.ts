import { type Page, expect } from '@playwright/test'
import { waitForNavigation } from '../helpers/wait'
import { TIMEOUTS, URL_PATTERNS } from '../constants'

export class HotelViewPage {
  constructor(private page: Page) {}

  /**
   * Waits for the hotel view page to load
   */
  async waitForLoad(): Promise<void> {
    await waitForNavigation(this.page, URL_PATTERNS.HOTEL_VIEW)
    await this.page.waitForSelector('.property-info', { timeout: TIMEOUTS.ELEMENT_VISIBLE })
  }

  /**
   * Verifies hotel details match expected values
   * @param expectedName - Expected hotel name
   * @param expectedRating - Expected hotel rating
   */
  async verifyHotelDetails(expectedName: string, expectedRating: string): Promise<void> {
    await expect(this.page.locator('.property-name')).toContainText(expectedName)
    
    // Verify rating matches
    const hotelViewRating = await this.page.locator('.rating-score').first().textContent()
    expect(hotelViewRating?.trim()).toBe(expectedRating?.trim())
    
    console.log('✓ Hotel view details verified')
  }

  /**
   * Selects the first room and returns room name
   * @returns Room name
   */
  async selectFirstRoom(): Promise<string> {
    // Wait for rooms to load
    await this.page.waitForSelector('.room-card', { timeout: TIMEOUTS.ELEMENT_VISIBLE })
    const firstRoom = this.page.locator('.room-card').first()
    await expect(firstRoom).toBeVisible()
    
    // Get room name for verification
    const roomName = await firstRoom.locator('.room-name').textContent()
    
    // Click Reserve button
    const reserveButton = firstRoom.locator('.reserve-btn')
    await expect(reserveButton).toBeVisible()
    await reserveButton.click()
    
    return roomName || ''
  }
}

