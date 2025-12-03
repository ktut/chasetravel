<script lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import type { Booking } from '@/stores/searchStore'
import { formatPrice, formatDate, formatShortDate, formatDateHeader } from '@/utils/formatters'
import FlightBooking from '@/components/FlightBooking.vue'
import HotelBooking from '@/components/HotelBooking.vue'
import ContactSupportSidebar from '@/components/ContactSupportSidebar.vue'

export default {
  name: 'MyBookings',
  components: {
    FlightBooking,
    HotelBooking,
    ContactSupportSidebar
  },
  data() {
    return {
      showPastBookings: false
    }
  },
  computed: {
    searchStore() {
      return useSearchStore()
    },
    allBookings(): Booking[] {
      return this.searchStore.bookings
    },
    currentBookings(): Booking[] {
      const now = new Date()
      return this.allBookings.filter(booking => {
        if (booking.type === 'flight' && booking.searchData) {
          const departureDate = new Date(booking.searchData.checkIn)
          return departureDate >= now
        } else if (booking.type === 'hotel' && booking.searchData) {
          const checkoutDate = new Date(booking.searchData.checkOut)
          return checkoutDate >= now
        }
        return true
      }).sort((a, b) => {
        // Sort by actual reservation date (check-in for hotels, departure for flights)
        const dateA = a.searchData?.checkIn ? new Date(a.searchData.checkIn) : new Date(a.bookingDate)
        const dateB = b.searchData?.checkIn ? new Date(b.searchData.checkIn) : new Date(b.bookingDate)
        return dateA.getTime() - dateB.getTime()
      })
    },
    pastBookings(): Booking[] {
      const now = new Date()
      return this.allBookings.filter(booking => {
        if (booking.type === 'flight' && booking.searchData) {
          const departureDate = new Date(booking.searchData.checkIn)
          return departureDate < now
        } else if (booking.type === 'hotel' && booking.searchData) {
          const checkoutDate = new Date(booking.searchData.checkOut)
          return checkoutDate < now
        }
        return false
      }).sort((a, b) => {
        // Sort by actual reservation date (check-in for hotels, departure for flights), most recent first
        const dateA = a.searchData?.checkIn ? new Date(a.searchData.checkIn) : new Date(a.bookingDate)
        const dateB = b.searchData?.checkIn ? new Date(b.searchData.checkIn) : new Date(b.bookingDate)
        return dateB.getTime() - dateA.getTime()
      })
    },
    hasBookings(): boolean {
      return this.allBookings.length > 0
    },
    groupedCurrentBookings(): { date: string; bookings: Booking[] }[] {
      const groups = new Map<string, Booking[]>()

      this.currentBookings.forEach(booking => {
        const dateKey = booking.searchData?.checkIn
          ? new Date(booking.searchData.checkIn).toDateString()
          : new Date(booking.bookingDate).toDateString()

        if (!groups.has(dateKey)) {
          groups.set(dateKey, [])
        }
        groups.get(dateKey)!.push(booking)
      })

      return Array.from(groups.entries()).map(([date, bookings]) => ({
        date,
        bookings: this.sortBookingsWithinGroup(bookings)
      }))
    },
    groupedPastBookings(): { date: string; bookings: Booking[] }[] {
      const groups = new Map<string, Booking[]>()

      this.pastBookings.forEach(booking => {
        const dateKey = booking.searchData?.checkIn
          ? new Date(booking.searchData.checkIn).toDateString()
          : new Date(booking.bookingDate).toDateString()

        if (!groups.has(dateKey)) {
          groups.set(dateKey, [])
        }
        groups.get(dateKey)!.push(booking)
      })

      return Array.from(groups.entries()).map(([date, bookings]) => ({
        date,
        bookings: this.sortBookingsWithinGroup(bookings)
      }))
    }
  },
  methods: {
    formatPrice,
    formatDate,
    formatShortDate,
    formatDateHeader,
    getBookingPrice(booking: Booking): number {
      if (booking.type === 'flight' && booking.flights && booking.flights.length > 0) {
        return booking.flights.reduce((sum, flight) => sum + flight.price, 0)
      } else if (booking.type === 'hotel' && booking.hotel && booking.searchData) {
        const nights = this.calculateNights(booking.searchData.checkIn, booking.searchData.checkOut)
        if (booking.room) {
          return booking.room.pricePerNight * nights
        }
        return booking.hotel.pricePerNight * nights
      }
      return 0
    },
    calculateNights(checkIn: Date | string, checkOut: Date | string): number {
      const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn
      const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays || 1
    },
    togglePastBookings() {
      this.showPastBookings = !this.showPastBookings
    },
    sortBookingsWithinGroup(bookings: Booking[]): Booking[] {
      // Sort bookings: flights first (by departure time), then hotels, then return flights
      return [...bookings].sort((a, b) => {
        // Both are flights
        if (a.type === 'flight' && b.type === 'flight') {
          // Sort by departure time if available
          if (a.flights?.[0]?.departure?.time && b.flights?.[0]?.departure?.time) {
            return a.flights[0].departure.time.localeCompare(b.flights[0].departure.time)
          }
          return 0
        }

        // Both are hotels
        if (a.type === 'hotel' && b.type === 'hotel') {
          return 0
        }

        // Mixed types: flights before hotels
        if (a.type === 'flight' && b.type === 'hotel') {
          return -1
        }
        if (a.type === 'hotel' && b.type === 'flight') {
          return 1
        }

        return 0
      })
    }
  }
}
</script>

<template>
  <div class="mybookings-page">
    <!-- Hero Background with Curved Mask -->
    <div class="hero-background">
      <div class="hero-image"></div>
    </div>

    <div class="mybookings-container">
      <h1 class="page-title">My Bookings</h1>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Left Column: Bookings List -->
        <div class="left-column">
          <!-- Empty State -->
          <div v-if="!hasBookings" class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="empty-icon">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <h2>No bookings yet</h2>
            <p>Your travel bookings will appear here once you make a purchase.</p>
            <router-link to="/" class="btn-primary">Start searching</router-link>
          </div>

          <!-- Current Bookings -->
          <section v-if="currentBookings.length > 0" class="bookings-section">
            <h2>Current Bookings</h2>

            <div v-for="group in groupedCurrentBookings" :key="group.date" class="date-group">
              <h3 class="date-header">{{ formatDateHeader(group.date) }}</h3>
              <div v-for="booking in group.bookings" :key="booking.id">
                <FlightBooking
                  v-if="booking.type === 'flight' && booking.flights"
                  :booking="booking"
                />
                <HotelBooking
                  v-else-if="booking.type === 'hotel' && booking.hotel"
                  :booking="booking"
                />
              </div>
            </div>
          </section>

          <!-- Past Bookings -->
          <section v-if="pastBookings.length > 0" class="past-bookings-section">
            <div class="past-bookings-container">
              <button @click="togglePastBookings" class="past-bookings-toggle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="toggle-icon" :class="{ rotated: showPastBookings }">
                  <path d="M9 5l7 7-7 7"/>
                </svg>
                Past Bookings ({{ pastBookings.length }})
              </button>

              <transition name="slide-down">
                <div v-if="showPastBookings" class="past-bookings-list">
                  <div v-for="group in groupedPastBookings" :key="group.date" class="date-group">
                    <h3 class="date-header">{{ formatDateHeader(group.date) }}</h3>
                    <div v-for="booking in group.bookings" :key="booking.id">
                      <FlightBooking
                        v-if="booking.type === 'flight' && booking.flights"
                        :booking="booking"
                      />
                      <HotelBooking
                        v-else-if="booking.type === 'hotel' && booking.hotel"
                        :booking="booking"
                      />
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </section>
        </div>

        <!-- Right Sidebar: Contact Support -->
        <aside class="right-sidebar">
          <ContactSupportSidebar />
        </aside>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mybookings-page {
  position: relative;
  margin: 0;
  padding: 0;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-image: url('@/assets/maldives.jpg');
  background-size: cover;
  background-position: 50% 40%;
  background-repeat: no-repeat;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 500px;
  overflow: visible;
  z-index: 0;

  @media (max-width: 768px) {
    height: 500px;
  }
}

.mybookings-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10rem 1.5rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media (max-width: 768px) {
    padding: 18rem 1rem 2rem;
  }
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  color: $color-primary;
  position: relative;
  z-index: 3;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 769px) {
    grid-template-columns: 1fr 380px;
  }
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.right-sidebar {
  @media (min-width: 769px) {
    position: sticky;
    top: 104px;
    align-self: flex-start;
  }
}

// Empty State
.empty-state {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  .empty-icon {
    width: 80px;
    height: 80px;
    color: #ccc;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  p {
    color: #666;
    font-size: 1rem;
    margin: 0;
    max-width: 400px;
  }

  .btn-primary {
    margin-top: 1rem;
    &:hover {
      color: white;
    }
  }
}

// Bookings Section
.bookings-section {
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: $color-primary;
  }
}

// Date Group
.date-group {
  margin-top: 4rem;

  &:first-of-type {
    margin-top: 2rem;;
  }
}

.date-header {
  font-size: 1.125rem;
  font-weight: 600;
  color: $color-primary;
  margin: 0 0 1rem 0;
}

.booking-card {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &.past {
    opacity: 0.8;
  }
}

.booking-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e5e5;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

.booking-type-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;

  svg {
    width: 16px;
    height: 16px;
  }

  &.flight {
    background: #e6f2ff;
    color: $color-accent;
  }

  &.hotel {
    background: #fff4e6;
    color: #c8a96e;
  }
}

.booking-date {
  color: #666;
  font-size: 0.875rem;
}

.booking-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  &.hotel-details {
    align-items: flex-start;
  }
}

.flight-info {
  flex: 1;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: $color-primary;
  }

  .reservation-date-emphasis {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #f0f7ff;
    border: 1px solid #d0e7ff;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 600;
    color: $color-accent;
    margin-bottom: 0.75rem;

    svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .nights-badge {
      margin-left: 0.5rem;
      padding: 0.25rem 0.75rem;
      background: white;
      border-radius: 4px;
      font-size: 0.875rem;
      color: $color-primary;
    }
  }

  .flight-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.5rem;

    .separator {
      color: #ccc;
    }
  }

  .time-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    color: #666;

    .time {
      font-weight: 600;
      color: $color-primary;
    }

    .duration {
      color: #999;
    }
  }
}

.hotel-details {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.hotel-image-container {
  .hotel-thumbnail {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;

    @media (max-width: 768px) {
      width: 100%;
      height: 150px;
    }
  }
}

.hotel-info {
  flex: 1;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: $color-primary;
  }

  .hotel-location {
    color: #666;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .hotel-stars {
    color: #ffa500;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .reservation-date-emphasis {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #f0f7ff;
    border: 1px solid #d0e7ff;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 600;
    color: $color-accent;
    margin-bottom: 0.75rem;

    svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .nights-badge {
      padding: 0.25rem 0.75rem;
      background: white;
      border-radius: 4px;
      font-size: 0.875rem;
      color: $color-primary;
    }
  }

  .hotel-dates {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #666;

    .separator {
      color: #ccc;
    }
  }

  .room-name {
    color: #666;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    font-style: italic;
  }
}

.booking-price-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;

  @media (max-width: 768px) {
    align-items: flex-start;
    width: 100%;
  }
}

.booking-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: $color-primary;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
}

.btn-cancel {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background: white;
  color: #666;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: #fee;
    border-color: #dc3545;
    color: #dc3545;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
}

// Past Bookings
.past-bookings-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e5e5;
}

.past-bookings-container {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}

.past-bookings-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border: none;
  padding: 1rem 1.5rem;
  width: 100%;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  color: $color-primary;
  transition: all 0.2s;

  &:hover {
    background: #f8f8f8;
  }

  .toggle-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.3s;

    &.rotated {
      transform: rotate(90deg);
    }
  }
}

.past-bookings-list {
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid #e5e5e5;
}

// Slide-down transition
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 3000px;
  opacity: 1;
}
</style>
