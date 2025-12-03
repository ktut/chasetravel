import { test, expect } from '@playwright/test'
import { HomePage } from './pages/HomePage'
import { ResultsPage } from './pages/ResultsPage'
import { TEST_LOCATIONS, DATE_INDICES, SELECTORS } from './constants'

/**
 * End-to-End Test: Search Update Flow
 *
 * This test validates the ability to update search parameters on the search results page:
 * 1. Perform initial flight search with specific dates
 * 2. On results page, change the dates using the calendar
 * 3. Click "Update" button
 * 4. Verify new dates appear in URL query parameters
 * 5. Verify search results update accordingly
 */

test.describe('Search Update Flow', () => {
  test('should update flight search dates on results page and reflect in URL', async ({ page }) => {
    // Initialize page objects
    const homePage = new HomePage(page)
    const resultsPage = new ResultsPage(page)

    // Step 1: Navigate to homepage and perform initial search
    await homePage.goto()
    await homePage.searchFlights(
      TEST_LOCATIONS.NEW_YORK,
      TEST_LOCATIONS.LOS_ANGELES,
      6, // 7th day for initial search
      11  // 12th day for initial search
    )

    // Step 2: Verify we're on search results page
    expect(page.url()).toContain('/search')
    expect(page.url()).toContain('type=flights')

    // Step 3: Update search dates
    const { initialUrl, updatedUrl } = await resultsPage.updateSearchDates(
      DATE_INDICES.SEARCH_UPDATE_START,
      DATE_INDICES.SEARCH_UPDATE_END
    )

    // Step 4: Verify URL has changed and contains new parameters
    expect(updatedUrl).toContain('/search')
    expect(updatedUrl).toContain('type=flights')
    resultsPage.verifyUrlChanged(initialUrl, updatedUrl)

    // Step 5: Verify search results have updated
    await page.waitForSelector(SELECTORS.FLIGHT_CARD, { timeout: 10000 })
    const flightCards = page.locator(SELECTORS.FLIGHT_CARD)
    await expect(flightCards.first()).toBeVisible()

    // Step 6: Verify widget is minimized after update
    await resultsPage.verifyWidgetMinimized()

    console.log('✓ All date update verifications passed!')
  })

  test('should update hotel search dates on results page and reflect in URL', async ({ page }) => {
    // Initialize page objects
    const homePage = new HomePage(page)
    const resultsPage = new ResultsPage(page)

    // Step 1: Navigate to homepage and perform initial hotel search
    await homePage.goto()
    await homePage.searchHotels(
      TEST_LOCATIONS.NEW_YORK,
      7,  // 8th day for initial check-in
      11  // 12th day for initial check-out
    )

    // Step 2: Verify we're on search results page
    expect(page.url()).toContain('/search')
    expect(page.url()).toContain('type=hotels')

    // Step 3: Update search dates
    const { initialUrl, updatedUrl } = await resultsPage.updateSearchDates(
      15, // 16th day for new check-in
      20  // 21st day for new check-out
    )

    // Step 4: Verify URL has changed and contains new parameters
    expect(updatedUrl).toContain('/search')
    expect(updatedUrl).toContain('type=hotels')
    resultsPage.verifyUrlChanged(initialUrl, updatedUrl)

    // Step 5: Verify search results have updated
    await page.waitForSelector(SELECTORS.HOTEL_CARD, { timeout: 10000 })
    const hotelCards = page.locator(SELECTORS.HOTEL_CARD)
    await expect(hotelCards.first()).toBeVisible()

    // Step 6: Verify widget is minimized after update
    await resultsPage.verifyWidgetMinimized()

    console.log('✓ All hotel date update verifications passed!')
  })
})
