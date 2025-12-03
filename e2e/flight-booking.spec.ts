import { test, expect } from '@playwright/test'
import { HomePage } from './pages/HomePage'
import { ResultsPage } from './pages/ResultsPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { BookingDetailPage } from './pages/BookingDetailPage'
import { TEST_LOCATIONS, DATE_INDICES, POINTS } from './constants'

/**
 * End-to-End Test: Flight Booking Flow
 *
 * This test validates the complete user journey from homepage to confirmation:
 * 1. Search for flights (New York → Chicago)
 * 2. Select the first flight result
 * 3. Verify confirmation page shows correct flight and search information
 * 4. Complete booking
 * 5. Reschedule booking dates
 */

test.describe('Booking E2E Flow', () => {
  test('should complete flight booking from homepage to confirmation with correct data', async ({ page }) => {
    // Initialize page objects
    const homePage = new HomePage(page)
    const resultsPage = new ResultsPage(page)
    const confirmationPage = new ConfirmationPage(page)
    const bookingDetailPage = new BookingDetailPage(page)

    // Step 1: Navigate to homepage and search for flights
    await homePage.goto()
    await homePage.searchFlights(
      TEST_LOCATIONS.NEW_YORK,
      TEST_LOCATIONS.CHICAGO,
      DATE_INDICES.FLIGHT_START,
      DATE_INDICES.FLIGHT_END
    )

    // Step 2: Verify we're on search results page
    expect(page.url()).toContain('/search')
    expect(page.url()).toContain('type=flights')

    // Step 3: Select first flight and capture details
    const { airline, departureAirport, arrivalAirport } = await resultsPage.selectFirstFlight()

    // Step 4: Verify confirmation page loaded
    await confirmationPage.waitForLoad()

    // Step 5: Verify flight details match
    await confirmationPage.verifyFlightDetails(airline, departureAirport, arrivalAirport)

    // Step 6: Verify fare selection
    await confirmationPage.verifyFareSelection()

    // Step 7: Verify booking sections
    await confirmationPage.verifyBookingSections()

    // Step 8: Test points redemption functionality
    await confirmationPage.testPointsRedemption(POINTS.FLIGHT_REDEMPTION)

    console.log('✓ All verifications passed!')

    // Step 9: Complete the booking
    await confirmationPage.completeBooking()

    // Step 10: Navigate to booking detail page
    await bookingDetailPage.navigateFromBookingsList()

    // Step 11: Reschedule booking dates
    await bookingDetailPage.rescheduleDates(
      DATE_INDICES.RESCHEDULE_START,
      DATE_INDICES.RESCHEDULE_END
    )

    console.log('✓ Flight booking E2E test completed successfully!')
  })
})
