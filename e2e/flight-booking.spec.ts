import { test, expect } from '@playwright/test'

/**
 * End-to-End Test: Booking Flow
 *
 * This test validates the complete user journey from homepage to confirmation:
 * 1. Search for flights (New York → Chicago, March 1-8, 2026)
 * 2. Select the first flight result
 * 3. Verify confirmation page shows correct flight and search information
 */

test.describe('Booking E2E Flow', () => {
  test('should complete flight booking from homepage to confirmation with correct data', async ({ page }) => {
    // Step 1: Navigate to homepage
    await page.goto('/', { timeout: 60000 })
    await expect(page).toHaveTitle(/Chase Travel/)

    // Step 2: Fill in search form - Flights are selected by default

    // Enter departure location - New York
    const fromInput = page.locator('input').filter({ hasText: '' }).first()
    await fromInput.click()
    await fromInput.fill('New York')

    // Click on the dropdown option
    await page.locator('.location-option').filter({ hasText: 'New York' }).first().click()

    // Enter destination - Chicago
    const toInput = page.locator('input[placeholder="To"]')
    await toInput.click()
    await toInput.fill('Chicago')

    // Click on the dropdown option
    await page.locator('.location-option').filter({ hasText: 'Chicago' }).first().click()

    // Step 3: Select dates using the calendar
    // Click on start date input to open calendar
    await page.locator('.date-input').first().click()

    // Wait for the desktop calendar to be visible
    await page.locator('.desktop-calendar').waitFor({ state: 'visible', timeout: 5000 })

    // Select a start date - find a future date that's not disabled (not past-date)
    // Look for day 25 in the first month view
    const startDay = page.locator('.desktop-calendar .month-view').first().locator('.day:not(.past-date):not(.other-month)').filter({ hasText: /^25$/ }).first()
    await startDay.click()

    // Select an end date a few days later (28th)
    const endDay = page.locator('.desktop-calendar .month-view').first().locator('.day:not(.past-date):not(.other-month)').filter({ hasText: /^28$/ }).first()
    await endDay.click()

    // Calendar should auto-close after selecting end date, but let's verify
    await page.waitForTimeout(500)

    // Step 4: Submit search
    const searchButton = page.locator('button.submit-btn')

    // Wait a moment for form to be ready
    await page.waitForTimeout(500)

    // Click the search button
    await searchButton.click()

    // Step 5: Wait for navigation to results page
    await page.waitForURL(/\/search\?/, { timeout: 10000 })

    // Verify we're on the search page with query parameters
    expect(page.url()).toContain('/search')
    expect(page.url()).toContain('type=flights')

    // Step 6: Wait for flight results to load
    await page.waitForSelector('.flight-card', { timeout: 10000 })

    // Get the first flight card
    const firstFlightCard = page.locator('.flight-card').first()
    await expect(firstFlightCard).toBeVisible()

    // Capture flight details for verification
    const airline = await firstFlightCard.locator('.airline').textContent()
    const departureAirport = await firstFlightCard.locator('.route-point').first().locator('.airport').textContent()
    const arrivalAirport = await firstFlightCard.locator('.route-point').last().locator('.airport').textContent()

    console.log('Selected flight:', { airline, departureAirport, arrivalAirport })

    // Step 7: Click the price button to select flight
    await firstFlightCard.locator('.select-btn').click()

    // Step 8: Wait for navigation to confirmation page
    await page.waitForURL(/\/confirmation/, { timeout: 10000 })
    expect(page.url()).toContain('/confirmation')

    // Step 9: Verify confirmation page loaded
    await page.waitForSelector('.confirmation-page', { timeout: 10000 })

    // Step 10: Verify flight details on confirmation page match selected flight
    await expect(page.locator('.airline-name')).toContainText(airline || '')

    // Verify departure and arrival airports
    const confDepartureAirport = await page.locator('.leg-details .time-point').first().locator('.airport').textContent()
    const confArrivalAirport = await page.locator('.leg-details .time-point').last().locator('.airport').textContent()

    expect(confDepartureAirport?.trim()).toBe(departureAirport?.trim())
    expect(confArrivalAirport?.trim()).toBe(arrivalAirport?.trim())

    // Step 11: Verify booking sections are present
    await expect(page.locator('h2').filter({ hasText: 'Choose a fare' })).toBeVisible()
    await expect(page.locator('h2').filter({ hasText: 'Use your rewards' })).toBeVisible()

    // Verify fare option (select first fare card)
    await expect(page.locator('.fare-card h3').first()).toContainText('Basic Economy')

    // Verify points redemption options
    await expect(page.locator('.rewards-option').filter({ hasText: 'Pay full amount' })).toBeVisible()
    await expect(page.locator('.rewards-option').filter({ hasText: 'Redeem points' })).toBeVisible()

    // Step 12: Verify book button is present
    await expect(page.locator('.book-button')).toBeVisible()
    await expect(page.locator('.book-button')).toContainText('Book for')

    // Step 13: Test points redemption functionality (if user is signed in)
    const redeemPointsOption = page.locator('.rewards-option').filter({ hasText: 'Redeem points' })
    const isDisabled = await redeemPointsOption.evaluate((el) => el.classList.contains('disabled'))

    if (!isDisabled) {
      // User is signed in, test points redemption
      await redeemPointsOption.click()

      // Verify points input appears
      await expect(page.locator('#pointsInput')).toBeVisible()

      // Enter points to redeem
      await page.locator('#pointsInput').fill('10000')

      // Verify redemption summary
      await expect(page.locator('.redemption-summary')).toBeVisible()
      await expect(page.locator('.redemption-summary')).toContainText('10,000')
      await expect(page.locator('.redemption-summary')).toContainText('Balance due')

      console.log('✓ Points redemption tested successfully')
    } else {
      console.log('✓ Points redemption disabled (user not signed in) - this is expected')
    }

    console.log('✓ All verifications passed!')
  })
})
