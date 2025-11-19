import { defineStore } from 'pinia'
import type { Flight, Hotel, Room, SearchData } from '@/types/search'

export interface Booking {
  id: string
  type: 'flight' | 'hotel'
  bookingDate: Date
  flight?: Flight
  hotel?: Hotel
  room?: Room
  searchData?: SearchData
}

export interface SearchState {
  selectedFlight: Flight | null
  pointsBalance: number
  isSignedIn: boolean
  bookings: Booking[]
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    selectedFlight: null,
    pointsBalance: 86060,
    isSignedIn: false,
    bookings: []
  }),

  actions: {
    setSelectedFlight(flight: Flight) {
      this.selectedFlight = flight
    },

    clearSelectedFlight() {
      this.selectedFlight = null
    },

    redeemPoints(amount: number) {
      if (amount <= this.pointsBalance) {
        this.pointsBalance -= amount
      }
    },

    signIn() {
      this.isSignedIn = true
    },

    signOut() {
      this.isSignedIn = false
    },

    addBooking(booking: Omit<Booking, 'id' | 'bookingDate'>) {
      const newBooking: Booking = {
        ...booking,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        bookingDate: new Date()
      }
      this.bookings.push(newBooking)
    }
  },

  persist: true
})
