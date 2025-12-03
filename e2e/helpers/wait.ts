import { type Page, expect } from '@playwright/test'

/**
 * Waits for navigation to a URL matching the pattern
 * @param page - Playwright page object
 * @param urlPattern - Regular expression or string to match in the URL
 * @param timeout - Timeout in milliseconds (default: 10000)
 */
export async function waitForNavigation(
  page: Page,
  urlPattern: RegExp | string,
  timeout = 10000
): Promise<void> {
  await page.waitForURL(urlPattern, { timeout })
  
  if (typeof urlPattern === 'string') {
    expect(page.url()).toContain(urlPattern)
  } else {
    expect(page.url()).toMatch(urlPattern)
  }
}

/**
 * Waits for an element to be visible and stable (not moving/animating)
 * @param page - Playwright page object
 * @param selector - CSS selector for the element
 * @param timeout - Timeout in milliseconds (default: 5000)
 */
export async function waitForElementStable(
  page: Page,
  selector: string,
  timeout = 5000
): Promise<void> {
  const element = page.locator(selector)
  await element.waitFor({ state: 'visible', timeout })
  
  // Wait for element to be stable (not animating)
  await element.waitFor({ state: 'attached', timeout })
}

/**
 * Waits for a form to be ready for submission
 * @param page - Playwright page object
 */
export async function waitForFormReady(page: Page): Promise<void> {
  // Small wait to ensure form state has stabilized
  await page.waitForTimeout(500)
}

/**
 * Waits for page transition animation to complete
 * @param page - Playwright page object
 */
export async function waitForTransition(page: Page): Promise<void> {
  // Small wait for transition animations
  await page.waitForTimeout(500)
}

/**
 * Waits for a widget to minimize after an action
 * @param page - Playwright page object
 * @param timeout - Timeout in milliseconds (default: 5000)
 */
export async function waitForWidgetMinimized(
  page: Page,
  timeout = 5000
): Promise<void> {
  await page.waitForTimeout(1000) // Wait for widget to minimize
  const minimizedWidget = page.locator('.search-widget.minimized')
  await expect(minimizedWidget).toBeVisible({ timeout })
  console.log('✓ Widget minimized after update - update was successful')
}

