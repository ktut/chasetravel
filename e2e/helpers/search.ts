import { type Page } from '@playwright/test'

/**
 * Fills a location input field with the specified location
 * @param page - Playwright page object
 * @param location - Location name (e.g., "New York", "Chicago")
 * @param isDestination - Whether this is a destination field (for flights)
 */
export async function fillLocationInput(
  page: Page,
  location: string,
  isDestination = false
): Promise<void> {
  // Select the appropriate input based on whether it's a destination
  const input = isDestination
    ? page.locator('input[placeholder="To"]').first()
    : page.locator('input').filter({ hasText: '' }).first()
  
  await input.click()
  await input.fill(location)
  
  // Click on the dropdown option
  await page.locator('.location-option').filter({ hasText: location }).first().click()
}

/**
 * Switches between search types (Flights/Stays)
 * @param page - Playwright page object
 * @param type - Search type ('flights' or 'stays')
 */
export async function selectSearchType(
  page: Page,
  type: 'flights' | 'stays'
): Promise<void> {
  const buttonText = type === 'flights' ? 'Flights' : 'Stays'
  const button = page.locator('.toggle-option').filter({ hasText: buttonText }).first()
  await button.click()
  
  // Verify the tab is active
  await page.waitForTimeout(300)
}

/**
 * Submits the search form
 * @param page - Playwright page object
 */
export async function submitSearch(page: Page): Promise<void> {
  const searchButton = page.locator('button.submit-btn').first()
  
  // Wait a moment for form to be ready
  await page.waitForTimeout(500)
  
  // Click the search button
  await searchButton.click()
}

/**
 * Waits for navigation to the search results page
 * @param page - Playwright page object
 * @param searchType - Expected search type in URL ('flights' or 'hotels')
 */
export async function waitForSearchResults(
  page: Page,
  searchType: 'flights' | 'hotels'
): Promise<void> {
  // Wait for navigation to results page
  await page.waitForURL(/\/search\?/, { timeout: 10000 })
  
  // Wait for results to load
  const resultSelector = searchType === 'flights' ? '.flight-card' : '.hotel-card'
  await page.waitForSelector(resultSelector, { timeout: 10000 })
}

/**
 * Expands the search widget if it's minimized (on results page)
 * @param page - Playwright page object
 */
export async function expandSearchWidget(page: Page): Promise<void> {
  const minimizedView = page.locator('.search-widget.minimized .minimized-view')
  const isMinimized = await minimizedView.isVisible({ timeout: 1000 }).catch(() => false)
  
  if (isMinimized) {
    await minimizedView.click()
    await page.waitForTimeout(500)
  }
}

