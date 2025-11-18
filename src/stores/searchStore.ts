import { defineStore } from 'pinia'
import type { Flight } from '@/types/search'

export interface SearchState {
  selectedFlight: Flight | null
  pointsBalance: number
  isSignedIn: boolean
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    selectedFlight: null,
    pointsBalance: 86060,
    isSignedIn: false
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
    }
  }
})
