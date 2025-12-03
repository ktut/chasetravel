/**
 * Test data constants for E2E tests
 */

// Test locations
export const TEST_LOCATIONS = {
  NEW_YORK: 'New York',
  CHICAGO: 'Chicago',
  LOS_ANGELES: 'Los Angeles',
} as const

// Default date indices for calendar selection (zero-based)
export const DATE_INDICES = {
  FLIGHT_START: 9, // 10th available day
  FLIGHT_END: 12, // 13th available day (3 days after start)
  HOTEL_CHECKIN: 4, // 5th available day
  HOTEL_CHECKOUT: 7, // 8th available day (3 days after check-in)
  SEARCH_UPDATE_START: 14, // 15th available day
  SEARCH_UPDATE_END: 19, // 20th available day
  RESCHEDULE_START: 14, // 15th available day for rescheduling
  RESCHEDULE_END: 17, // 18th available day for rescheduling
} as const

// Points amounts for testing
export const POINTS = {
  FLIGHT_REDEMPTION: 10000,
  HOTEL_REDEMPTION: 15000,
} as const

// Common selectors
export const SELECTORS = {
  // Calendar
  CALENDAR: '.calendar',
  DESKTOP_CALENDAR: '.desktop-calendar',
  DATE_INPUT: '.date-input',
  DAY_AVAILABLE: '.desktop-calendar .day:not(.past-date):not(.other-month)',
  DAY_SELECTED: '.desktop-calendar .day.selected',
  
  // Search
  LOCATION_OPTION: '.location-option',
  SUBMIT_BTN: 'button.submit-btn',
  SEARCH_WIDGET: '.search-widget',
  MINIMIZED_VIEW: '.search-widget.minimized .minimized-view',
  
  // Results
  FLIGHT_CARD: '.flight-card',
  HOTEL_CARD: '.hotel-card',
  SELECT_BTN: '.select-btn',
  
  // Booking
  BOOK_BUTTON: '.book-button',
  BOOKING_CARD: '.booking-card',
  BOOKING_DETAIL_CONTENT: '.booking-detail-content',
  
  // Confirmation
  CONFIRMATION_PAGE: '.confirmation-page',
  REWARDS_OPTION: '.rewards-option',
  REDEMPTION_SUMMARY: '.redemption-summary',
  POINTS_INPUT: '#pointsInput',
  
  // Reschedule
  RESCHEDULE_SECTION: '.reschedule-section',
  RESCHEDULE_ACTIONS: '.reschedule-actions',
  SUCCESS_NOTICE: '.success-notice',
  BOOKING_DATES_HEADER: '.booking-dates-header',
} as const

// URL patterns
export const URL_PATTERNS = {
  SEARCH: /\/search\?/,
  CONFIRMATION: /\/confirmation/,
  MY_BOOKINGS: /\/mybookings/,
  BOOKING_DETAIL: /\/booking\/[a-f0-9-]+/,
  HOTEL_VIEW: /\/hotel\/\d+/,
} as const

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  PAGE_LOAD: 60000,
  NAVIGATION: 10000,
  ELEMENT_VISIBLE: 10000,
  CALENDAR_VISIBLE: 5000,
  SHORT_WAIT: 500,
  FORM_READY: 500,
  RESCHEDULE_SUBMIT: 2500,
  WIDGET_MINIMIZE: 1000,
} as const

