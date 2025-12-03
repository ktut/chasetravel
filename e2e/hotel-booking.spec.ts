import { test, expect } from '@playwright/test'
import { HomePage } from './pages/HomePage'
import { ResultsPage } from './pages/ResultsPage'
import { HotelViewPage } from './pages/HotelViewPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { BookingDetailPage } from './pages/BookingDetailPage'
import { TEST_LOCATIONS, DATE_INDICES, POINTS } from './constants'

/**
 * End-to-End Test: Hotel Booking Flow
 *
 * This test validates the complete user journey from homepage to confirmation:
 * 1. Search for hotels (New York)
 * 2. Select the first hotel result
 * 3. Select a room
 * 4. Verify confirmation page shows correct hotel and search information
 * 5. Complete booking
 * 6. Reschedule booking dates
 */

test.describe('Hotel Booking E2E Flow', () => {
  test('should complete hotel booking from homepage to confirmation with correct data', async ({ page }) => {
    // Initialize page objects
    const homePage = new HomePage(page)
    const resultsPage = new ResultsPage(page)
    const hotelViewPage = new HotelViewPage(page)
    const confirmationPage = new ConfirmationPage(page)
    const bookingDetailPage = new BookingDetailPage(page)

    // Step 1: Navigate to homepage and search for hotels
    await homePage.goto()
    await homePage.searchHotels(
      TEST_LOCATIONS.NEW_YORK,
      DATE_INDICES.HOTEL_CHECKIN,
      DATE_INDICES.HOTEL_CHECKOUT
    )

    // Step 2: Verify we're on search results page
    expect(page.url()).toContain('/search')
    expect(page.url()).toContain('type=hotels')

    // Step 3: Select first hotel and capture details
    const { hotelName, hotelRating } = await resultsPage.selectFirstHotel()

    // Step 4: Verify hotel view page loaded and details match
    await hotelViewPage.waitForLoad()
    await hotelViewPage.verifyHotelDetails(hotelName, hotelRating)

    // Step 5: Select a room
    const roomName = await hotelViewPage.selectFirstRoom()
    console.log('Selected room:', roomName)

    // Step 6: Verify confirmation page loaded
    await confirmationPage.waitForLoad()

    // Step 7: Verify hotel details on confirmation page
    await confirmationPage.verifyHotelDetails(hotelName, hotelRating)

    // Step 8: Verify hotel stay information
    await confirmationPage.verifyHotelStayInfo()

    // Step 9: Verify booking sections
    await confirmationPage.verifyBookingSections()

    // Step 10: Test points redemption functionality
    await confirmationPage.testPointsRedemption(POINTS.HOTEL_REDEMPTION)

    console.log('✓ All hotel booking verifications passed!')

    // Step 11: Complete the booking
    await confirmationPage.completeBooking()

    // Step 12: Navigate to booking detail page
    await bookingDetailPage.navigateFromBookingsList()

    // Step 13: Reschedule booking dates (use different indices for hotel reschedule)
    await bookingDetailPage.rescheduleDates(
      DATE_INDICES.FLIGHT_START, // Use 10th day for hotel reschedule
      DATE_INDICES.FLIGHT_END    // Use 13th day for hotel reschedule
    )

    console.log('✓ Hotel booking E2E test completed successfully!')
  })
})
