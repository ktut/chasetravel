import { test, expect } from '@playwright/test'

/**
 * End-to-End Test: Hotel Booking Flow
 *
 * This test validates the complete user journey from homepage to confirmation:
 * 1. Search for hotels (New York, check-in/check-out dates)
 * 2. Select the first hotel result
 * 3. Verify confirmation page shows correct hotel and search information
 */

test.describe('Hotel Booking E2E Flow', () => {
  test('should complete hotel booking from homepage to confirmation with correct data', async ({ page }) => {
    // Step 1: Navigate to homepage
    await page.goto('/', { timeout: 60000 })
    await expect(page).toHaveTitle(/Chase Travel/)

    // Step 2: Switch to Stays (Hotels) search
    const staysButton = page.locator('.toggle-btn').filter({ hasText: 'Stays' })
    await staysButton.click()

    // Verify the Stays tab is active
    await expect(staysButton).toHaveClass(/active/)

    // Step 3: Fill in search form for hotels

    // Enter location - New York
    const locationInput = page.locator('input').filter({ hasText: '' }).first()
    await locationInput.click()
    await locationInput.fill('New York')

    // Click on the dropdown option
    await page.locator('.location-option').filter({ hasText: 'New York' }).first().click()

    // Step 4: Select dates using the calendar
    // Click on start date input to open calendar
    await page.locator('.date-input').first().click()

    // Wait for the desktop calendar to be visible
    await page.locator('.desktop-calendar').waitFor({ state: 'visible', timeout: 5000 })

    // Select a check-in date - find a future date that's not disabled (not past-date)
    // Look for day 22 in the first month view
    const checkInDay = page.locator('.desktop-calendar .month-view').first().locator('.day:not(.past-date):not(.other-month)').filter({ hasText: /^22$/ }).first()
    await checkInDay.click()

    // Select a check-out date a few days later (26th)
    const checkOutDay = page.locator('.desktop-calendar .month-view').first().locator('.day:not(.past-date):not(.other-month)').filter({ hasText: /^26$/ }).first()
    await checkOutDay.click()

    // Calendar should auto-close after selecting end date, but let's verify
    await page.waitForTimeout(500)

    // Step 5: Submit search
    const searchButton = page.locator('button.submit-btn')

    // Wait a moment for form to be ready
    await page.waitForTimeout(500)

    // Click the search button
    await searchButton.click()

    // Step 6: Wait for navigation to results page
    await page.waitForURL(/\/search\?/, { timeout: 10000 })

    // Verify we're on the search page with query parameters
    expect(page.url()).toContain('/search')
    expect(page.url()).toContain('type=hotels')

    // Step 7: Wait for hotel results to load
    await page.waitForSelector('.hotel-card', { timeout: 10000 })

    // Get the first hotel card
    const firstHotelCard = page.locator('.hotel-card').first()
    await expect(firstHotelCard).toBeVisible()

    // Capture hotel details for verification
    const hotelName = await firstHotelCard.locator('.hotel-name').textContent()
    const hotelRating = await firstHotelCard.locator('.rating-score').textContent()

    console.log('Selected hotel:', { hotelName, hotelRating })

    // Step 8: Click the select button to view hotel details (use the visible one - desktop or mobile)
    await firstHotelCard.locator('.select-btn').first().click()

    // Step 9: Wait for navigation to hotel view page
    await page.waitForURL(/\/hotel\/\d+/, { timeout: 10000 })
    expect(page.url()).toMatch(/\/hotel\/\d+/)

    // Step 10: Verify hotel view page loaded with property info
    await page.waitForSelector('.property-info', { timeout: 10000 })
    await expect(page.locator('.property-name')).toContainText(hotelName || '')

    // Verify rating matches
    const hotelViewRating = await page.locator('.rating-score').first().textContent()
    expect(hotelViewRating?.trim()).toBe(hotelRating?.trim())

    // Step 11: Wait for rooms to load and select a room
    await page.waitForSelector('.room-card', { timeout: 10000 })
    const firstRoom = page.locator('.room-card').first()
    await expect(firstRoom).toBeVisible()

    // Get room name for verification
    const roomName = await firstRoom.locator('.room-name').textContent()

    // Step 12: Click Reserve button on the first room
    const reserveButton = firstRoom.locator('.reserve-btn')
    await expect(reserveButton).toBeVisible()
    await reserveButton.click()

    // Step 13: Wait for navigation to confirmation page
    await page.waitForURL(/\/confirmation/, { timeout: 10000 })
    expect(page.url()).toContain('/confirmation')

    // Step 14: Verify confirmation page loaded with hotel details section
    await page.waitForSelector('.hotel-details-section', { timeout: 10000 })

    // Step 15: Verify hotel details on confirmation page match selected hotel
    await expect(page.locator('.hotel-info h3')).toContainText(hotelName || '')

    // Verify rating matches
    const confHotelRating = await page.locator('.hotel-info .rating-score').textContent()
    expect(confHotelRating?.trim()).toBe(hotelRating?.trim())

    // Verify room information is displayed if a room was selected
    const roomDetail = page.locator('.stay-detail').filter({ hasText: 'Room:' })
    if (await roomDetail.count() > 0) {
      await expect(roomDetail).toContainText(roomName || '')
    }

    // Step 16: Verify hotel stay information is present
    await expect(page.locator('.hotel-stay-info')).toBeVisible()

    // Verify check-in and check-out dates are displayed
    const stayDetails = page.locator('.stay-detail')
    await expect(stayDetails.filter({ hasText: 'Check-in:' })).toBeVisible()
    await expect(stayDetails.filter({ hasText: 'Check-out:' })).toBeVisible()
    await expect(stayDetails.filter({ hasText: 'night' }).first()).toBeVisible()
    await expect(stayDetails.filter({ hasText: 'Price per night:' })).toBeVisible()

    // Step 17: Verify booking sections are present
    await expect(page.locator('h2').filter({ hasText: 'Use your rewards' })).toBeVisible()

    // Verify rewards redemption options
    await expect(page.locator('.rewards-option').filter({ hasText: 'Pay full amount' })).toBeVisible()
    await expect(page.locator('.rewards-option').filter({ hasText: 'Redeem points' })).toBeVisible()

    // Step 18: Verify book button is present
    await expect(page.locator('.book-button')).toBeVisible()
    await expect(page.locator('.book-button')).toContainText('Book for')

    // Step 19: Test points redemption functionality (if user is signed in)
    const redeemPointsOption = page.locator('.rewards-option').filter({ hasText: 'Redeem points' })
    const isDisabled = await redeemPointsOption.evaluate((el) => el.classList.contains('disabled'))

    if (!isDisabled) {
      // User is signed in, test points redemption
      await redeemPointsOption.click()

      // Verify points input appears
      await expect(page.locator('#pointsInput')).toBeVisible()

      // Enter points to redeem
      await page.locator('#pointsInput').fill('15000')

      // Verify redemption summary
      await expect(page.locator('.redemption-summary')).toBeVisible()
      await expect(page.locator('.redemption-summary')).toContainText('15,000')
      await expect(page.locator('.redemption-summary')).toContainText('Balance due')

      console.log('✓ Points redemption tested successfully')
    } else {
      console.log('✓ Points redemption disabled (user not signed in) - this is expected')
    }

    console.log('✓ All hotel booking verifications passed!')
  })
})
