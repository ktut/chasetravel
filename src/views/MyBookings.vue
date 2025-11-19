<script lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import type { Booking } from '@/stores/searchStore'
import FlightBooking from '@/components/FlightBooking.vue'
import HotelBooking from '@/components/HotelBooking.vue'

export default {
  name: 'MyBookings',
  components: {
    FlightBooking,
    HotelBooking
  },
  data() {
    return {
      showPastBookings: false,
      contactForm: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
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
    formatPrice(price: number): string {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(price)
    },
    formatDate(date: Date | string): string {
      const d = typeof date === 'string' ? new Date(date) : date
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },
    formatShortDate(date: Date | string): string {
      const d = typeof date === 'string' ? new Date(date) : date
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    },
    formatDateHeader(dateString: string): string {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    },
    getBookingPrice(booking: Booking): number {
      if (booking.type === 'flight' && booking.flight) {
        return booking.flight.price
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
    submitContactForm() {
      alert('Contact form submitted! (This is a placeholder - not functional yet)')
      this.contactForm = { name: '', email: '', subject: '', message: '' }
    },
    cancelBooking(bookingId: string) {
      if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        this.searchStore.removeBooking(bookingId)
      }
    },
    sortBookingsWithinGroup(bookings: Booking[]): Booking[] {
      // Sort bookings: flights first (by departure time), then hotels, then return flights
      return [...bookings].sort((a, b) => {
        // Both are flights
        if (a.type === 'flight' && b.type === 'flight') {
          // Sort by departure time if available
          if (a.flight?.departure?.time && b.flight?.departure?.time) {
            return a.flight.departure.time.localeCompare(b.flight.departure.time)
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
                  v-if="booking.type === 'flight' && booking.flight"
                  :booking="booking"
                  @cancel="cancelBooking"
                />
                <HotelBooking
                  v-else-if="booking.type === 'hotel' && booking.hotel"
                  :booking="booking"
                  @cancel="cancelBooking"
                />
              </div>
            </div>
          </section>

          <!-- Past Bookings -->
          <section v-if="pastBookings.length > 0" class="past-bookings-section">
            <button @click="togglePastBookings" class="past-bookings-toggle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="toggle-icon" :class="{ rotated: showPastBookings }">
                <path d="M19 9l-7 7-7-7"/>
              </svg>
              Past Bookings ({{ pastBookings.length }})
            </button>

            <div v-if="showPastBookings" class="past-bookings-list">
              <div v-for="group in groupedPastBookings" :key="group.date" class="date-group">
                <h3 class="date-header">{{ formatDateHeader(group.date) }}</h3>
                <div v-for="booking in group.bookings" :key="booking.id">
                  <FlightBooking
                    v-if="booking.type === 'flight' && booking.flight"
                    :booking="booking"
                    @cancel="cancelBooking"
                  />
                  <HotelBooking
                    v-else-if="booking.type === 'hotel' && booking.hotel"
                    :booking="booking"
                    @cancel="cancelBooking"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Sidebar: Contact Support -->
        <aside class="right-sidebar">
          <div class="contact-support-card">
            <h2>Contact Support</h2>

            <!-- Phone Numbers -->
            <div class="support-section">
              <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                Call Us
              </h3>
              <div class="support-item prominent">
                <div class="support-label">Chase Travel Specialist</div>
                <a href="tel:888-511-5326" class="support-link phone">888-511-5326</a>
              </div>
              <div class="support-item prominent">
                <div class="support-label">Chase Sapphire Reserve Support</div>
                <div class="support-sublabel reserve-label">For Chase Sapphire Reserve Cardholders</div>
                <a href="tel:800-436-7970" class="support-link phone">800-436-7970</a>
                <div class="support-sublabel">USA</div>
                <a href="tel:614-776-7050" class="support-link phone secondary-phone">614-776-7050</a>
                <div class="support-sublabel">International</div>
              </div>
            </div>

            <!-- iMessage Support -->
            <div class="support-section">
              <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                Message Us
              </h3>
              <a href="sms:&body=I need help with my Chase Travel booking" class="support-item imessage-link">
                <img src="@/assets/imessage.png" alt="iMessage" class="imessage-icon" />
                <span>Contact via iMessage</span>
              </a>
            </div>

            <!-- Email Support -->
            <div class="support-section">
              <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email Us
              </h3>
              <div class="support-item">
                <a href="mailto:help@chasetravel.com" class="support-link email">help@chasetravel.com</a>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="support-section">
              <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Send Us a Message
              </h3>

              <form @submit.prevent="submitContactForm" class="contact-form">
                <div class="form-group">
                  <label for="name">Name</label>
                  <input type="text" id="name" v-model="contactForm.name" required />
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" v-model="contactForm.email" required />
                </div>
                <div class="form-group">
                  <label for="subject">Subject</label>
                  <input type="text" id="subject" v-model="contactForm.subject" required />
                </div>
                <div class="form-group">
                  <label for="message">Message</label>
                  <textarea id="message" v-model="contactForm.message" rows="4" required></textarea>
                </div>
                <button type="submit" class="btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mybookings-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16rem 1.5rem 3rem;

  @media (max-width: 768px) {
    padding: 11rem 1rem 2rem;
  }
}

.mybookings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  color: $color-primary;

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
    color: $color-primary;
  }

  p {
    color: #666;
    font-size: 1rem;
    margin: 0;
    max-width: 400px;
  }

  .btn-primary {
    margin-top: 1rem;
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
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
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

.past-bookings-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  width: 100%;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  color: $color-primary;
  transition: all 0.2s;

  &:hover {
    background: #f8f8f8;
    border-color: $color-accent;
  }

  .toggle-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.3s;

    &.rotated {
      transform: rotate(180deg);
    }
  }
}

.past-bookings-list {
  margin-top: 1rem;
}

// Contact Support Card
.contact-support-card {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1.5rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: $color-primary;
  }
}

.support-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e5e5;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: $color-primary;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      width: 18px;
      height: 18px;
    }
  }
}

.support-item {
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  &.prominent {
    background: #f8f8f8;
    padding: 1rem;
    border-radius: 6px;
    border-left: 3px solid $color-accent;
  }

  &.imessage-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #f0f7ff;
    border: 1px solid #d0e7ff;
    border-radius: 6px;
    text-decoration: none;
    color: $color-accent;
    font-weight: 600;
    transition: all 0.2s;

    &:hover {
      background: #e6f2ff;
      border-color: $color-accent;
    }

    .imessage-icon {
      width: 32px;
      height: 32px;
    }
  }
}

.support-label {
  font-weight: 600;
  color: $color-primary;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.support-sublabel {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;

  &.reserve-label {
    font-size: 0.8rem;
    color: $color-accent;
    font-weight: 600;
    margin-bottom: 0.75rem;
    margin-top: 0;
  }
}

.support-link {
  display: inline-block;
  text-decoration: none;
  transition: all 0.2s;

  &.phone {
    font-size: 1.25rem;
    font-weight: 700;
    color: $color-accent;

    &:hover {
      color: #004a94;
    }

    &.secondary-phone {
      font-size: 1.125rem;
      margin-top: 0.75rem;
      display: block;
    }
  }

  &.email {
    color: $color-accent;
    text-decoration: underline;

    &:hover {
      color: #004a94;
    }
  }
}

.contact-form-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: $color-accent;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.875rem 1.25rem;
  width: 100%;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #004a94;
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.contact-form {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 600;
    color: $color-primary;
    font-size: 0.875rem;
  }

  input,
  textarea {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.95rem;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: $color-accent;
      box-shadow: 0 0 0 2px rgba(29, 79, 145, 0.1);
    }
  }

  textarea {
    resize: vertical;
  }
}
</style>
