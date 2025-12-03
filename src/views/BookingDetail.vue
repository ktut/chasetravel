<script lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import type { Booking } from '@/stores/searchStore'
import { formatDate } from '@/utils/formatters'
import FlightBooking from '@/components/FlightBooking.vue'
import HotelBooking from '@/components/HotelBooking.vue'
import ContactSupportSidebar from '@/components/ContactSupportSidebar.vue'
import Calendar from '@/components/Calendar.vue'

export default {
  name: 'BookingDetail',
  components: {
    FlightBooking,
    HotelBooking,
    ContactSupportSidebar,
    Calendar
  },
  data() {
    return {
      booking: null as Booking | null,
      newCheckIn: null as Date | null,
      newCheckOut: null as Date | null,
      newCheckInFlexibility: 'exact',
      newCheckOutFlexibility: 'exact',
      isSubmitting: false,
      showSuccessNotice: false,
      error: null as string | null
    }
  },
  computed: {
    searchStore() {
      return useSearchStore()
    },
    datesChanged() {
      if (!this.booking || !this.booking.searchData) return false
      if (!this.newCheckIn || !this.newCheckOut) return false

      const originalCheckIn = new Date(this.booking.searchData.checkIn).getTime()
      const originalCheckOut = new Date(this.booking.searchData.checkOut).getTime()

      return this.newCheckIn.getTime() !== originalCheckIn ||
             this.newCheckOut.getTime() !== originalCheckOut ||
             this.newCheckInFlexibility !== this.booking.searchData.checkInFlexibility ||
             this.newCheckOutFlexibility !== this.booking.searchData.checkOutFlexibility
    },
    isPastBooking() {
      if (!this.booking || !this.booking.searchData) return false
      const checkoutDate = new Date(this.booking.searchData.checkOut)
      const now = new Date()
      now.setHours(0, 0, 0, 0) // Compare dates only, not times
      return checkoutDate < now
    }
  },
  mounted() {
    const bookingId = this.$route.params.id as string
    this.booking = this.searchStore.bookings.find(b => b.id === bookingId) || null

    if (!this.booking) {
      this.error = 'The booking you are looking for does not exist or has been removed.'
      return
    }

    if (!this.booking.searchData) {
      this.error = 'This booking does not have date information and cannot be rescheduled.'
      return
    }

    // Initialize with current dates
    this.newCheckIn = new Date(this.booking.searchData.checkIn)
    this.newCheckOut = new Date(this.booking.searchData.checkOut)
    this.newCheckInFlexibility = this.booking.searchData.checkInFlexibility || 'exact'
    this.newCheckOutFlexibility = this.booking.searchData.checkOutFlexibility || 'exact'
  },
  methods: {
    formatDate,
    handleDateRangeSelected(data: {
      checkIn: Date | null,
      checkOut: Date | null,
      checkInFlexibility?: string,
      checkOutFlexibility?: string
    }) {
      this.newCheckIn = data.checkIn
      this.newCheckOut = data.checkOut
      if (data.checkInFlexibility) {
        this.newCheckInFlexibility = data.checkInFlexibility
      }
      if (data.checkOutFlexibility) {
        this.newCheckOutFlexibility = data.checkOutFlexibility
      }
    },
    resetDates() {
      if (this.booking && this.booking.searchData) {
        this.newCheckIn = new Date(this.booking.searchData.checkIn)
        this.newCheckOut = new Date(this.booking.searchData.checkOut)
        this.newCheckInFlexibility = this.booking.searchData.checkInFlexibility || 'exact'
        this.newCheckOutFlexibility = this.booking.searchData.checkOutFlexibility || 'exact'
      }
    },
    async submitReschedule() {
      if (!this.booking || !this.newCheckIn || !this.newCheckOut) return

      this.isSubmitting = true

      // 2-second delay as requested
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update store
      this.searchStore.updateBookingDates(this.booking.id, {
        checkIn: this.newCheckIn,
        checkOut: this.newCheckOut,
        checkInFlexibility: this.newCheckInFlexibility,
        checkOutFlexibility: this.newCheckOutFlexibility
      })

      // Update local booking reference
      this.booking = this.searchStore.bookings.find(b => b.id === this.booking!.id) || null

      this.isSubmitting = false
      this.showSuccessNotice = true

      // Scroll to top to show notice
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    cancelBooking() {
      if (!this.booking) return

      if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        this.searchStore.removeBooking(this.booking.id)
        this.$router.push('/mybookings')
      }
    }
  }
}
</script>

<template>
  <div class="booking-detail-page">
    <!-- Hero Background -->
    <div class="hero-background">
      <div class="hero-image"></div>
      <div class="hero-mask"></div>
    </div>

    <div class="booking-detail-container">
      <!-- Error State -->
      <div v-if="error" class="error-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="error-icon">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h2>Booking Not Found</h2>
        <p>{{ error }}</p>
        <router-link to="/mybookings" class="btn-primary">
          Back to My Bookings
        </router-link>
      </div>

      <!-- Main Content -->
      <div v-else-if="booking" class="booking-detail-content">
        <h1 class="page-title">My Booking</h1>
        <div v-if="booking.searchData" class="booking-dates-header">
          {{ formatDate(booking.searchData.checkIn) }} - {{ formatDate(booking.searchData.checkOut) }}
        </div>

        <div class="content-grid">
          <!-- Left Column -->
          <div class="left-column">
            <!-- Success Notice -->
            <transition name="notice-fade">
              <div v-if="showSuccessNotice" class="success-notice" role="alert">
                <div class="notice-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <div class="notice-content">
                  <h3>Booking Updated Successfully!</h3>
                  <p>We have sent a date change request to the third-party provider. Please allow up to one business day to process. If there are any issues, contact support. Support is already aware of your booking change request, you will not need to provide additional information.</p>
                </div>
                <button
                  @click="showSuccessNotice = false"
                  class="notice-close"
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              </div>
            </transition>

            <!-- Booking Display -->
            <div class="booking-display">
              <FlightBooking
                v-if="booking.type === 'flight' && booking.flights"
                :booking="booking"
              />
              <HotelBooking
                v-else-if="booking.type === 'hotel' && booking.hotel"
                :booking="booking"
              />
            </div>

            <!-- Reschedule Section -->
            <section v-if="booking.searchData" class="reschedule-section">
              <h2>Reschedule Your Booking</h2>
              <p class="section-description">
                Select new dates for your {{ booking.type === 'hotel' ? 'stay' : 'trip' }}.
              </p>

              <Calendar
                :initialCheckIn="newCheckIn || booking.searchData.checkIn"
                :initialCheckOut="newCheckOut || booking.searchData.checkOut"
                :initialCheckInFlexibility="newCheckInFlexibility"
                :initialCheckOutFlexibility="newCheckOutFlexibility"
                :isOneWay="false"
                @date-range-selected="handleDateRangeSelected"
              />

              <div v-if="datesChanged" class="reschedule-actions">
                <button @click="resetDates" class="btn-secondary">Cancel Changes</button>
                <button
                  @click="submitReschedule"
                  :disabled="isSubmitting"
                  class="btn-primary"
                >
                  <span v-if="isSubmitting" class="loading-spinner"></span>
                  <span v-else>Confirm New Dates</span>
                </button>
              </div>
            </section>

            <!-- Cancel Booking Button (only for current bookings) -->
            <div v-if="!isPastBooking" class="cancel-booking-section">
              <button @click="cancelBooking" class="btn-cancel-booking">
                Cancel Booking
              </button>
            </div>
          </div>

          <!-- Right Sidebar -->
          <aside class="right-sidebar">
            <ContactSupportSidebar />
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;

.booking-detail-page {
  position: relative;
  margin: 0;
  padding: 0;
}

// Hero Background
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 500px;
  overflow: hidden;
  z-index: 0;

  @media (max-width: 768px) {
    height: 300px;
  }
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@/assets/maldives.jpg');
  background-size: cover;
  background-position: center;
  filter: brightness(0.85);
}

.hero-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 50%, rgb(255, 255, 255) 100%);
}

.booking-detail-container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 10rem 1.5rem 3rem;

  @media (max-width: 768px) {
    padding: 6rem 1rem 2rem;
  }
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: $color-primary;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.booking-dates-header {
  font-size: 1.5rem;
  font-weight: 600;
  color: $color-accent;
  margin: 0 0 2rem 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
}

// Error State
.error-state {
  max-width: 500px;
  margin: 5rem auto;
  padding: 3rem 2rem;
  text-align: center;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;

  .error-icon {
    width: 64px;
    height: 64px;
    color: #dc3545;
    margin: 0 auto 1.5rem;
  }

  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: $color-primary;
  }

  p {
    color: #666;
    font-size: 1rem;
    margin: 0 0 2rem 0;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    margin: 2rem 1rem;
    padding: 2rem 1.5rem;
  }
}

// Content Grid
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 769px) {
    grid-template-columns: 1fr 380px;
  }
}

.right-sidebar {
  @media (min-width: 769px) {
    position: sticky;
    top: 104px;
    align-self: flex-start;
  }
}

// Success Notice
.success-notice {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: start;

  .notice-icon {
    width: 40px;
    height: 40px;
    background: #28a745;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 24px;
      height: 24px;
      color: white;
    }
  }

  .notice-content {
    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #155724;
      margin: 0 0 0.5rem 0;
    }

    p {
      font-size: 0.95rem;
      color: #155724;
      margin: 0;
      line-height: 1.5;
    }
  }

  .notice-close {
    background: none;
    border: none;
    font-size: 1.75rem;
    line-height: 1;
    color: #155724;
    cursor: pointer;
    padding: 0;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    transition: all 0.2s;

    &:hover {
      color: #0c3d1a;
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
    grid-template-columns: auto 1fr;

    .notice-close {
      grid-column: 1 / -1;
      justify-self: center;
      margin-top: 0.5rem;
    }
  }
}

.notice-fade-enter-active {
  transition: all 0.3s ease-out;
}

.notice-fade-leave-active {
  transition: all 0.2s ease-in;
}

.notice-fade-enter-from,
.notice-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

// Booking Display
.booking-display {
  margin-bottom: 2rem;

  // Make the booking card non-clickable
  :deep(.booking-card) {
    cursor: default;

    &:hover {
      transform: none;
    }

    &:focus {
      outline: none;
    }
  }
}

// Reschedule Section
.reschedule-section {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.75rem 0;
    color: $color-primary;
  }

  .section-description {
    color: #666;
    font-size: 0.95rem;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;

    strong {
      color: $color-primary;
      font-weight: 600;
    }
  }
}

.reschedule-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem;
    margin: 0 -1.5rem -1.5rem;
    border-top: 1px solid #e5e5e5;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
    gap: 0.75rem;

    .btn-primary,
    .btn-secondary {
      flex: 1;
      padding: 0.875rem 1rem;
    }
  }
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background: white;
  color: #666;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    border-color: #ccc;
  }
}

.loading-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spinner 0.6s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

// Cancel Booking Section
.cancel-booking-section {
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;

  @media (max-width: 768px) {
    padding-top: 1rem;
    margin-bottom: 2rem;
  }
}

.btn-cancel-booking {
  padding: 0.75rem 1.5rem;
  border: 2px solid #dc3545;
  border-radius: 6px;
  background: white;
  color: #dc3545;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dc3545;
    color: white;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
  }
}
</style>
