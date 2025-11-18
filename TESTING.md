# Testing Documentation

## End-to-End Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end testing. All E2E tests are automatically run on every commit to ensure the application works as expected.

### Test Coverage

#### Flight Booking Flow Test (`e2e/flight-booking.spec.ts`)

This comprehensive test validates the entire flight booking user journey:

**Test Steps:**
1. **Homepage Setup**
   - Navigate to the homepage
   - Verify page loads correctly

2. **Search Form Completion**
   - Fill in departure location (New York)
   - Fill in destination (Chicago)
   - Submit search form

3. **Flight Results**
   - Wait for navigation to results page
   - Verify URL contains correct search parameters
   - Wait for flight results to load
   - Capture details from first flight card

4. **Flight Selection**
   - Click price button on first flight
   - Navigate to confirmation page

5. **Confirmation Page Verification**
   - Verify correct flight details display
   - Match airline name
   - Match departure/arrival airports
   - Verify fare selection (Basic Economy)
   - Verify points redemption options

6. **Points Redemption Testing**
   - Select "Redeem points" option
   - Enter 10,000 points
   - Verify redemption summary updates
   - Verify balance due calculation
   - Verify book button is present

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
2. **Flow Changes**: If the booking flow changes
3. **New Features**: Add new test cases for new features
4. **Bug Fixes**: Add regression tests for fixed bugs
5. **Data Structure Changes**: If search or flight data structures change

**Test Update Guidelines:**

- Use semantic selectors (text, roles) when possible
- Add comments for complex interactions
- Verify both positive and negative test cases
- Keep tests independent and idempotent
- Capture and log important data for debugging

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

## Expected Flow

The E2E test validates this complete user flow:

1. User starts on homepage (/)
2. User fills in search form:
   - Enters "New York" as departure
   - Enters "Chicago" as destination
   - (Uses default dates)
3. User clicks search button
4. Application navigates to /search with URL parameters
5. Flight results load and display
6. User clicks on first flight's price button
7. Flight data is stored in sessionStorage
8. Application navigates to /confirmation using `window.location.href`
9. Confirmation page reads flight data from sessionStorage
10. Page displays:
    - Route information
    - Flight details (airline, airports)
    - Fare selection (Basic Economy)
    - Points redemption options
    - Book button
11. User can select "Redeem points" and enter amount
12. Balance due updates based on points redeemed

## Test Data

The test works with:
- **Departure**: New York, NY
- **Destination**: Chicago, IL
- **Flight**: First available result from mock data
- **Points Redemption**: 10,000 points for testing

This validates that the complete flow works from search to confirmation.
