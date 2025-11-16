import { defineStore } from 'pinia'

export interface SearchState {
  searchResults: any[]
  searchType: 'flights' | 'hotels'
  isInitialized: boolean
  searchData: {
    searchType: string
    location: string
    destination?: string | null
    checkIn: Date | null
    checkOut: Date | null
    checkInFlexibility: string
    checkOutFlexibility: string
    passengers: {
      adults: number
      children: number
      total: number
    }
  } | null
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    searchResults: [],
    searchType: 'flights',
    isInitialized: false,
    searchData: null
  }),

  actions: {
    setSearchResults(results: any[], type: 'flights' | 'hotels') {
      this.searchResults = results
      this.searchType = type
      this.isInitialized = true
    },

    setSearchData(data: any) {
      this.searchData = data
    },

    clearSearch() {
      this.searchResults = []
      this.isInitialized = false
      this.searchData = null
    }
  }
})
