# Testing Documentation

## End-to-End Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end testing. All E2E tests are automatically run on every commit to ensure the application works as expected.

### Test Infrastructure

The test suite uses a modular architecture with reusable helpers and page objects to improve maintainability and reduce code duplication.

#### Test Helpers (`e2e/helpers/`)

Reusable helper functions for common test operations:

- **`calendar.ts`**: Calendar interaction helpers
  - `openCalendar(page)` - Opens the calendar picker
  - `selectDateRange(page, startDayIndex, endDayIndex)` - Selects date range
  - `openCalendarAndSelectDates(page, startDayIndex, endDayIndex)` - Combined operation

- **`search.ts`**: Search form helpers
  - `fillLocationInput(page, location, isDestination)` - Fills location inputs
  - `selectSearchType(page, type)` - Switches between Flights/Stays
  - `submitSearch(page)` - Submits the search form
  - `waitForSearchResults(page, searchType)` - Waits for results to load
  - `expandSearchWidget(page)` - Expands minimized search widget

- **`booking.ts`**: Booking flow helpers
  - `testPointsRedemption(page, pointsAmount)` - Tests points redemption
  - `completeBooking(page)` - Completes booking and navigates to My Bookings
  - `navigateToBookingDetail(page)` - Navigates to booking detail page
  - `rescheduleBooking(page, newStartDayIndex, newEndDayIndex)` - Reschedules dates
  - `verifyBookingSections(page)` - Verifies standard booking sections

- **`wait.ts`**: Wait strategy helpers
  - `waitForNavigation(page, urlPattern, timeout)` - Waits for URL navigation
  - `waitForElementStable(page, selector, timeout)` - Waits for stable element
  - `waitForFormReady(page)` - Waits for form to be ready
  - `waitForTransition(page)` - Waits for transition animations
  - `waitForWidgetMinimized(page, timeout)` - Waits for widget to minimize

#### Page Objects (`e2e/pages/`)

Encapsulate page-specific logic and interactions:

- **`HomePage.ts`**: Homepage interactions
  - `goto()` - Navigates to homepage
  - `searchFlights(from, to, startDayIndex, endDayIndex)` - Performs flight search
  - `searchHotels(location, checkInDayIndex, checkOutDayIndex)` - Performs hotel search

- **`ResultsPage.ts`**: Search results page interactions
  - `selectFirstFlight()` - Selects first flight and returns details
  - `selectFirstHotel()` - Selects first hotel and returns details
  - `updateSearchDates(startDayIndex, endDayIndex)` - Updates search dates
  - `verifyUrlChanged(initialUrl, updatedUrl)` - Verifies URL parameters changed
  - `verifyWidgetMinimized()` - Verifies widget is minimized after update

- **`HotelViewPage.ts`**: Hotel detail page interactions
  - `waitForLoad()` - Waits for page to load
  - `verifyHotelDetails(expectedName, expectedRating)` - Verifies hotel details
  - `selectFirstRoom()` - Selects first room and returns room name

- **`ConfirmationPage.ts`**: Confirmation page interactions
  - `waitForLoad()` - Waits for page to load
  - `verifyFlightDetails(airline, departureAirport, arrivalAirport)` - Verifies flight details
  - `verifyFareSelection()` - Verifies fare selection
  - `verifyHotelDetails(name, rating)` - Verifies hotel details
  - `verifyHotelStayInfo()` - Verifies hotel stay information
  - `verifyBookingSections()` - Verifies booking sections
  - `testPointsRedemption(pointsAmount)` - Tests points redemption
  - `completeBooking()` - Completes the booking

- **`BookingDetailPage.ts`**: Booking detail page interactions
  - `navigateFromBookingsList()` - Navigates from bookings list
  - `rescheduleDates(newStartDayIndex, newEndDayIndex)` - Reschedules booking dates

#### Test Constants (`e2e/constants.ts`)

Centralized test data and configuration:

- `TEST_LOCATIONS` - Test location names (New York, Chicago, Los Angeles)
- `DATE_INDICES` - Default date indices for calendar selection
- `POINTS` - Points amounts for redemption testing
- `SELECTORS` - Common CSS selectors
- `URL_PATTERNS` - URL pattern regular expressions
- `TIMEOUTS` - Standard timeout values

### Test Coverage

#### Flight Booking Flow Test (`e2e/flight-booking.spec.ts`)

Validates the complete flight booking journey from search to reschedule:

**Test Steps:**
1. Navigate to homepage and search for flights
2. Select first flight from results
3. Verify confirmation page with flight details
4. Verify fare selection and booking sections
5. Test points redemption functionality
6. Complete booking
7. Navigate to booking detail page
8. Reschedule booking dates and verify success

#### Hotel Booking Flow Test (`e2e/hotel-booking.spec.ts`)

Validates the complete hotel booking journey from search to reschedule:

**Test Steps:**
1. Navigate to homepage and search for hotels
2. Select first hotel from results
3. View hotel details and select a room
4. Verify confirmation page with hotel details
5. Verify stay information and booking sections
6. Test points redemption functionality
7. Complete booking
8. Navigate to booking detail page
9. Reschedule booking dates and verify success

#### Search Update Flow Test (`e2e/search-update.spec.ts`)

Validates the ability to update search parameters on results page:

**Test Steps (Flight & Hotel):**
1. Perform initial search with specific dates
2. On results page, change dates using calendar
3. Click "Update" button
4. Verify new dates appear in URL query parameters
5. Verify search results update accordingly
6. Verify widget is minimized after update

### Running Tests

**Run all E2E tests (headless):**
```bash
npm run test
```

**Run tests in headed mode (visible browser):**
```bash
npm run test:headed
```

**Run tests with UI mode (interactive):**
```bash
npm run test:ui
```

**Run tests in debug mode:**
```bash
npm run test:debug
```

**Run specific test file:**
```bash
npx playwright test e2e/flight-booking.spec.ts
```

**View test report:**
```bash
npx playwright show-report
```

### Automated Test Execution

Tests are automatically executed in the following scenarios:

1. **Pre-commit Hook**: All E2E tests run before every commit
   - Located in `.git/hooks/pre-commit`
   - Prevents commits if tests fail
   - Can be bypassed with `git commit --no-verify` (not recommended)

2. **Manual Testing**: Developers can run tests manually using the commands above

### Test Configuration

The Playwright configuration is defined in `playwright.config.ts`:

- **Test Directory**: `./e2e`
- **Base URL**: `http://localhost:5173`
- **Browser**: Chromium (Desktop Chrome)
- **Workers**: 1 (sequential execution)
- **Web Server**: Automatically starts dev server before tests
- **Screenshots**: Captured on test failure
- **Video**: Recorded on test failure
- **Trace**: Retained on test failure for debugging

### Maintaining Tests

**When to Update Tests:**

1. **UI Changes**: If UI elements change (classes, selectors, text)
   - Update selectors in `e2e/constants.ts`
   - Update affected page objects in `e2e/pages/`
   - Tests themselves typically don't need changes

2. **Flow Changes**: If the booking flow changes
   - Update relevant page object methods
   - Update helper functions if interaction patterns change

3. **New Features**: Add new test cases for new features
   - Reuse existing helpers and page objects
   - Add new methods to page objects as needed
   - Add new constants to `e2e/constants.ts`

4. **Bug Fixes**: Add regression tests for fixed bugs
   - Create focused test cases using existing infrastructure

5. **Data Structure Changes**: If search or flight data structures change
   - Update constants in `e2e/constants.ts`
   - Update page objects if data extraction logic changes

**Test Update Guidelines:**

- **Use the modular infrastructure**: Leverage helpers and page objects instead of writing low-level Playwright code
- **Update in one place**: Changes to UI typically only require updates to page objects or helpers
- **Add new helpers**: If you find repeated code, extract it to a helper function
- **Keep page objects focused**: Each page object should handle one page's interactions
- **Use constants**: Define test data and selectors in `e2e/constants.ts`
- **Semantic selectors**: Continue using semantic selectors (text, roles) when possible
- **Independent tests**: Keep tests independent and idempotent
- **Log important data**: Capture and log data for debugging

**Example: Adding a New Test**

```typescript
import { test, expect } from '@playwright/test'
import { HomePage } from './pages/HomePage'
import { ResultsPage } from './pages/ResultsPage'
import { TEST_LOCATIONS, DATE_INDICES } from './constants'

test('should filter flight results', async ({ page }) => {
  const homePage = new HomePage(page)
  const resultsPage = new ResultsPage(page)
  
  await homePage.goto()
  await homePage.searchFlights(
    TEST_LOCATIONS.NEW_YORK,
    TEST_LOCATIONS.CHICAGO,
    DATE_INDICES.FLIGHT_START,
    DATE_INDICES.FLIGHT_END
  )
  
  // Add new filter-specific logic here
})
```

### Debugging Failed Tests

1. **Check Screenshots**: Playwright captures screenshots on failure in `test-results/`
2. **View Trace**: Run `npx playwright show-trace <trace-file>` to see detailed execution
3. **Run in Headed Mode**: Use `npm run test:headed` to see browser interactions
4. **Use Debug Mode**: Use `npm run test:debug` for step-by-step debugging
5. **Check Console Logs**: Test output includes console.log statements

### CI/CD Integration

The test suite is designed to run in CI/CD environments:
- Retries failing tests 2 times in CI
- Uses headless mode by default
- Generates detailed reports
- Captures screenshots, videos, and traces on failure

## Test Architecture Benefits

The modular test infrastructure provides several key benefits:

1. **Reduced Code Duplication**: Test files reduced by 60-70% through shared helpers
2. **Improved Maintainability**: UI changes only require updates in one place (page objects)
3. **Better Reliability**: Proper wait strategies replace arbitrary timeouts
4. **Easier to Read**: Tests focus on what they're testing, not low-level interactions
5. **Faster to Write**: New tests can leverage existing infrastructure

## Expected Flows

### Flight Booking Flow

1. User starts on homepage (/)
2. User fills in search form with departure, destination, and dates
3. User clicks search button
4. Application navigates to /search with URL parameters
5. Flight results load and display
6. User clicks on first flight's select button
7. Flight data is stored in sessionStorage
8. Application navigates to /confirmation
9. Confirmation page displays flight details, fare options, and booking sections
10. User can optionally redeem points
11. User completes booking
12. Application navigates to /mybookings
13. User can reschedule booking dates from detail page

### Hotel Booking Flow

1. User starts on homepage (/)
2. User switches to "Stays" tab
3. User fills in location and dates
4. User clicks search button
5. Application navigates to /search with URL parameters
6. Hotel results load and display
7. User clicks on first hotel's select button
8. Application navigates to /hotel/:id
9. User selects a room
10. Application navigates to /confirmation
11. Confirmation page displays hotel and room details
12. User can optionally redeem points
13. User completes booking
14. Application navigates to /mybookings
15. User can reschedule booking dates from detail page

### Search Update Flow

1. User performs initial search (flight or hotel)
2. User arrives at results page with minimized search widget
3. User expands search widget
4. User changes search parameters (e.g., dates)
5. Update button becomes enabled
6. User clicks Update button
7. URL parameters update with new values
8. Search results refresh with new parameters
9. Search widget minimizes automatically

## Test Data

Tests use centralized constants defined in `e2e/constants.ts`:

- **Locations**: New York, Chicago, Los Angeles
- **Date Indices**: Predefined indices for calendar date selection
- **Points**: 10,000 for flights, 15,000 for hotels
- **Results**: Tests use first available result from mock data

This modular approach validates the complete flows while maintaining clean, maintainable test code.
