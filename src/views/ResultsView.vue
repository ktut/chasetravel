<script lang="ts">
import Results from '@/components/Results.vue'
import { getMockFlightResults } from '@/services/MockFlightResults'
import { getMockHotelResults } from '@/services/MockHotelResults'
import { useSearchStore } from '@/stores/searchStore'

export default {
  name: 'ResultsView',
  components: {
    Results
  },
  setup() {
    const searchStore = useSearchStore()
    return { searchStore }
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
  computed: {
    searchResults() {
      return this.searchStore.searchResults
    },
    searchType() {
      return this.searchStore.searchType
    },
    isInitialized() {
      return this.searchStore.isInitialized
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

      // Store search data in Pinia
      this.searchStore.setSearchData(searchData)

      // Get mock results based on search type
      if (searchData.searchType === 'flights') {
        const results = getMockFlightResults(searchData)
        this.searchStore.setSearchResults(results, 'flights')
      } else if (searchData.searchType === 'hotels') {
        const results = getMockHotelResults(searchData)
        this.searchStore.setSearchResults(results, 'hotels')
      }
    }
  }
}
</script>

<template>
  <div>
    <div v-if="isInitialized" class="search-view">
      <div class="results-section">
        <Results :results="searchResults" :searchType="searchType" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-view {
  min-height: 100vh;
  background: white;
  margin-top: 60px;

  @media (max-width: $breakpoint-mobile) {
    margin-top: 50px;
  }
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
