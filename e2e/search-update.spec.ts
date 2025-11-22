import { test, expect } from '@playwright/test'

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
    // Step 1: Navigate to homepage
    await page.goto('/', { timeout: 60000 })
    await expect(page).toHaveTitle(/Chase Travel/)

    // Step 2: Fill in initial search form - Flights are selected by default

    // Enter departure location - New York
    const fromInput = page.locator('input').filter({ hasText: '' }).first()
    await fromInput.click()
    await fromInput.fill('New York')
    await page.locator('.location-option').filter({ hasText: 'New York' }).first().click()

    // Enter destination - Los Angeles
    const toInput = page.locator('input[placeholder="To"]').first()
    await toInput.click()
    await toInput.fill('Los Angeles')
    await page.locator('.location-option').filter({ hasText: 'Los Angeles' }).first().click()

    // Step 3: Select initial dates using the calendar
    await page.locator('.date-input').first().click()
    await page.locator('.desktop-calendar').waitFor({ state: 'visible', timeout: 5000 })
    await page.waitForTimeout(500) // Wait for calendar to fully render

    // Select start date - day 15 (check both month views)
    const startDay = page.locator('.desktop-calendar .day:not(.past-date):not(.other-month)').filter({ hasText: /^15$/ }).first()
    await expect(startDay).toBeVisible({ timeout: 5000 })
    await startDay.click()

    // Select end date - day 20 (check both month views)
    const endDay = page.locator('.desktop-calendar .day:not(.past-date):not(.other-month)').filter({ hasText: /^20$/ }).first()
    await expect(endDay).toBeVisible({ timeout: 5000 })
    await endDay.click()

    await page.waitForTimeout(500)

    // Step 4: Submit initial search
    const searchButton = page.locator('button.submit-btn').filter({ hasText: 'Search' }).first()
    await page.waitForTimeout(500)
    await searchButton.click()

    // Step 5: Wait for navigation to results page
    await page.waitForURL(/\/search\?/, { timeout: 10000 })
    expect(page.url()).toContain('/search')
    expect(page.url()).toContain('type=flights')

    // Capture initial URL with dates
    const initialUrl = page.url()
    console.log('Initial URL:', initialUrl)

    // Step 6: Wait for flight results to load
    await page.waitForSelector('.flight-card', { timeout: 10000 })

    // Step 7: Check if search widget is minimized and expand it if needed
    const minimizedView = page.locator('.search-widget.minimized .minimized-view')
    if (await minimizedView.isVisible({ timeout: 1000 }).catch(() => false)) {
      await minimizedView.click()
      await page.waitForTimeout(500)
    }

    // Step 8: Verify the Update button is initially disabled (no changes made yet)
    const updateButton = page.locator('button.submit-btn').filter({ hasText: 'Update' }).first()
    await expect(updateButton).toBeVisible({ timeout: 5000 })

    // Get initial disabled state
    const initiallyDisabled = await updateButton.isDisabled()
    console.log('Update button initially disabled:', initiallyDisabled)

    // Step 9: Change dates on the search results page
    // Click on start date input to open calendar again
    await page.locator('.date-input').first().click()
    await page.locator('.desktop-calendar').waitFor({ state: 'visible', timeout: 5000 })
    await page.waitForTimeout(500) // Wait for calendar to fully render

    // Select new start date - day 18 (check both month views)
    const newStartDay = page.locator('.desktop-calendar .day:not(.past-date):not(.other-month)').filter({ hasText: /^18$/ }).first()
    await expect(newStartDay).toBeVisible({ timeout: 5000 })
    await newStartDay.click()

    // Select new end date - day 23 (check both month views)
    const newEndDay = page.locator('.desktop-calendar .day:not(.past-date):not(.other-month)').filter({ hasText: /^23$/ }).first()
    await expect(newEndDay).toBeVisible({ timeout: 5000 })
    await newEndDay.click()

    await page.waitForTimeout(500)

    // Step 10: Verify Update button is now enabled (changes detected)
    const nowEnabled = await updateButton.isEnabled()
    console.log('Update button now enabled:', nowEnabled)
    expect(nowEnabled).toBe(true)

    // Step 11: Click the Update button
    await updateButton.click()

    // Step 12: Wait for URL to update with new dates
    await page.waitForTimeout(1000)
    const updatedUrl = page.url()
    console.log('Updated URL:', updatedUrl)

    // Step 13: Verify URL has changed and contains new parameters
    expect(updatedUrl).not.toBe(initialUrl)
    expect(updatedUrl).toContain('/search')
    expect(updatedUrl).toContain('type=flights')

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

    // Verify the dates contain day 18 and 23 (in format YYYY-MM-DD)
    expect(updatedCheckIn).toMatch(/\d{4}-\d{2}-18/)
    expect(updatedCheckOut).toMatch(/\d{4}-\d{2}-23/)

    // Step 14: Verify search results have updated
    await page.waitForSelector('.flight-card', { timeout: 10000 })
    const flightCards = page.locator('.flight-card')
    await expect(flightCards.first()).toBeVisible()

    // Step 15: Verify widget is minimized after update (which indicates successful update)
    await page.waitForTimeout(1000) // Wait for widget to minimize
    const minimizedWidget = page.locator('.search-widget.minimized')
    await expect(minimizedWidget).toBeVisible({ timeout: 5000 })
    console.log('✓ Widget minimized after update - update was successful')

    console.log('✓ All date update verifications passed!')
  })

  test('should update hotel search dates on results page and reflect in URL', async ({ page }) => {
    // Step 1: Navigate to homepage
    await page.goto('/', { timeout: 60000 })
    await expect(page).toHaveTitle(/Chase Travel/)

    // Step 2: Switch to Stays (Hotels) search
    const staysButton = page.locator('.toggle-option').filter({ hasText: 'Stays' }).first()
    await staysButton.click()
    await expect(staysButton).toHaveClass(/active/)

    // Step 3: Fill in initial search form

    // Enter location - New York
    const locationInput = page.locator('input').filter({ hasText: '' }).first()
    await locationInput.click()
    await locationInput.fill('New York')
    await page.locator('.location-option').filter({ hasText: 'New York' }).first().click()

    // Step 4: Select initial dates using the calendar
    await page.locator('.date-input').first().click()
    await page.locator('.desktop-calendar').waitFor({ state: 'visible', timeout: 5000 })
    await page.waitForTimeout(500) // Wait for calendar to fully render

    // Select check-in date - day 12 (check both month views)
    const checkInDay = page.locator('.desktop-calendar .day:not(.past-date):not(.other-month)').filter({ hasText: /^12$/ }).first()
    await expect(checkInDay).toBeVisible({ timeout: 5000 })
    await checkInDay.click()

    // Select check-out date - day 16 (check both month views)
    const checkOutDay = page.locator('.desktop-calendar .day:not(.past-date):not(.other-month)').filter({ hasText: /^16$/ }).first()
    await expect(checkOutDay).toBeVisible({ timeout: 5000 })
    await checkOutDay.click()

    await page.waitForTimeout(500)

    // Step 5: Submit initial search
    const searchButton = page.locator('button.submit-btn').filter({ hasText: 'Search' }).first()
    await page.waitForTimeout(500)
    await searchButton.click()

    // Step 6: Wait for navigation to results page
    await page.waitForURL(/\/search\?/, { timeout: 10000 })
    expect(page.url()).toContain('/search')
    expect(page.url()).toContain('type=hotels')

    // Capture initial URL with dates
    const initialUrl = page.url()
    console.log('Initial hotel URL:', initialUrl)

    // Step 7: Wait for hotel results to load
    await page.waitForSelector('.hotel-card', { timeout: 10000 })

    // Step 8: Check if search widget is minimized and expand it if needed
    const minimizedView = page.locator('.search-widget.minimized .minimized-view')
    if (await minimizedView.isVisible({ timeout: 1000 }).catch(() => false)) {
      await minimizedView.click()
      await page.waitForTimeout(500)
    }

    // Step 9: Verify the Update button is initially disabled
    const updateButton = page.locator('button.submit-btn').filter({ hasText: 'Update' }).first()
    await expect(updateButton).toBeVisible({ timeout: 5000 })
    const initiallyDisabled = await updateButton.isDisabled()
    console.log('Update button initially disabled:', initiallyDisabled)

    // Step 10: Change dates on the search results page
    await page.locator('.date-input').first().click()
    await page.locator('.desktop-calendar').waitFor({ state: 'visible', timeout: 5000 })
    await page.waitForTimeout(500) // Wait for calendar to fully render

    // Select new check-in date - day 14 (check both month views)
    const newCheckInDay = page.locator('.desktop-calendar .day:not(.past-date):not(.other-month)').filter({ hasText: /^14$/ }).first()
    await expect(newCheckInDay).toBeVisible({ timeout: 5000 })
    await newCheckInDay.click()

    // Select new check-out date - day 19 (check both month views)
    const newCheckOutDay = page.locator('.desktop-calendar .day:not(.past-date):not(.other-month)').filter({ hasText: /^19$/ }).first()
    await expect(newCheckOutDay).toBeVisible({ timeout: 5000 })
    await newCheckOutDay.click()

    await page.waitForTimeout(500)

    // Step 11: Verify Update button is now enabled
    const nowEnabled = await updateButton.isEnabled()
    console.log('Update button now enabled:', nowEnabled)
    expect(nowEnabled).toBe(true)

    // Step 11: Click the Update button
    await updateButton.click()

    // Step 12: Wait for URL to update with new dates
    await page.waitForTimeout(1000)
    const updatedUrl = page.url()
    console.log('Updated hotel URL:', updatedUrl)

    // Step 13: Verify URL has changed and contains new parameters
    expect(updatedUrl).not.toBe(initialUrl)
    expect(updatedUrl).toContain('/search')
    expect(updatedUrl).toContain('type=hotels')

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

    // Verify the dates contain day 14 and 19 (in format YYYY-MM-DD)
    expect(updatedCheckIn).toMatch(/\d{4}-\d{2}-14/)
    expect(updatedCheckOut).toMatch(/\d{4}-\d{2}-19/)

    // Step 14: Verify search results have updated
    await page.waitForSelector('.hotel-card', { timeout: 10000 })
    const hotelCards = page.locator('.hotel-card')
    await expect(hotelCards.first()).toBeVisible()

    // Step 15: Verify widget is minimized after update (which indicates successful update)
    await page.waitForTimeout(1000) // Wait for widget to minimize
    const minimizedWidget = page.locator('.search-widget.minimized')
    await expect(minimizedWidget).toBeVisible({ timeout: 5000 })
    console.log('✓ Widget minimized after update - update was successful')

    console.log('✓ All hotel date update verifications passed!')
  })
})
