<script lang="ts">
import SearchWidget from '@/components/SearchWidget.vue'
import Results from '@/components/Results.vue'
import { getMockFlightResults } from '@/services/MockFlightResults'
import { getMockHotelResults } from '@/services/MockHotelResults'

export default {
  name: 'SearchView',
  components: {
    SearchWidget,
    Results
  },
  data() {
    return {
      searchResults: [] as any[],
      searchType: 'flights' as 'flights' | 'hotels',
      isInitialized: false
    }
  },
  mounted() {
    // Read query parameters and perform search
    this.initializeFromQueryParams()
  },
  watch: {
    '$route.query': {
      handler() {
        // Re-run search when query params change
        this.initializeFromQueryParams()
      },
      deep: true
    }
  },
  methods: {
    initializeFromQueryParams() {
      const query = this.$route.query

      // Build search data from query parameters
      const searchData = {
        searchType: (query.type as string) || 'flights',
        location: query.from as string,
        destination: query.to as string,
        checkIn: query.checkIn ? new Date(query.checkIn as string) : null,
        checkOut: query.checkOut ? new Date(query.checkOut as string) : null,
        checkInFlexibility: query.checkInFlex as string || 'exact',
        checkOutFlexibility: query.checkOutFlex as string || 'exact',
        passengers: {
          adults: parseInt(query.adults as string) || 1,
          children: parseInt(query.children as string) || 0,
          total: (parseInt(query.adults as string) || 1) + (parseInt(query.children as string) || 0)
        }
      }

      // Get mock results based on search type
      if (searchData.searchType === 'flights') {
        this.searchResults = getMockFlightResults(searchData)
        this.searchType = 'flights'
      } else if (searchData.searchType === 'hotels') {
        this.searchResults = getMockHotelResults(searchData)
        this.searchType = 'hotels'
      }

      this.isInitialized = true
    },
    handleSearchSubmitted(searchData: any) {
      // Build query parameters from search data
      const query: any = {
        type: searchData.searchType,
        from: searchData.location,
        adults: searchData.passengers.adults,
        children: searchData.passengers.children
      }

      if (searchData.destination) {
        query.to = searchData.destination
      }

      if (searchData.checkIn) {
        query.checkIn = searchData.checkIn.toISOString()
      }

      if (searchData.checkOut) {
        query.checkOut = searchData.checkOut.toISOString()
      }

      if (searchData.checkInFlexibility) {
        query.checkInFlex = searchData.checkInFlexibility
      }

      if (searchData.checkOutFlexibility) {
        query.checkOutFlex = searchData.checkOutFlexibility
      }

      // Update the route with new query parameters
      this.$router.push({ path: '/search', query })
    }
  }
}
</script>

<template>
  <div>
    <div class="search-header">
      <div class="search-widget-container">
        <SearchWidget @search-submitted="handleSearchSubmitted" />
      </div>
    </div>

    <div v-if="isInitialized" class="search-view">
      <div class="results-section">
        <Results :results="searchResults" :searchType="searchType" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 60px;
  z-index: 100;
  padding: 1rem 0;
  margin-top: 60px;

  @media (max-width: $breakpoint-mobile) {
    top: 50px;
    margin-top: 50px;
    padding: 0.5rem 0;
  }
}

.search-widget-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 968px) {
    padding: 0 0.5rem;
  }
}

.search-view {
  min-height: 100vh;
  background: white;
}

.results-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 0;

  @media (max-width: 968px) {
    padding: 1rem 0;
  }
}
</style>
