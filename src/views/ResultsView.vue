<script lang="ts">
import Results from '@/components/Results.vue'
import Search404 from './Search404.vue'
import { getMockFlightResults } from '@/services/MockFlightResults'
import { getMockHotelResults } from '@/services/MockHotelResults'
import { validateSearchParams, parseSearchDataFromQuery } from '@/types/search'
import type { SearchData } from '@/types/search'

export default {
  name: 'ResultsView',
  components: {
    Results,
    Search404
  },
  data() {
    return {
      searchData: null as SearchData | null,
      searchResults: [] as any[],
      validationErrors: [] as string[],
      isValid: false,
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
  computed: {
    searchType(): 'flights' | 'hotels' {
      return this.searchData?.searchType || 'flights'
    }
  },
  methods: {
    initializeFromQueryParams() {
      const query = this.$route.query

      // Check if there are any query params at all
      const hasQueryParams = Object.keys(query).length > 0

      // If no query params, redirect to home
      if (!hasQueryParams) {
        this.$router.replace('/')
        return
      }

      // Validate URL parameters
      const validation = validateSearchParams(query)

      if (!validation.valid) {
        this.isValid = false
        this.validationErrors = validation.errors
        this.isInitialized = true
        return
      }

      // Parse search data from valid query params
      const searchData = parseSearchDataFromQuery(query)

      if (!searchData) {
        this.isValid = false
        this.validationErrors = ['Unable to parse search parameters']
        this.isInitialized = true
        return
      }

      // Store search data locally
      this.searchData = searchData
      this.isValid = true
      this.validationErrors = []

      // Get mock results based on search type
      if (searchData.searchType === 'flights') {
        this.searchResults = getMockFlightResults(searchData)
      } else if (searchData.searchType === 'hotels') {
        this.searchResults = getMockHotelResults(searchData)
      }

      this.isInitialized = true
    }
  }
}
</script>

<template>
  <div v-if="isInitialized">
    <div v-if="isValid" class="search-view">
      <div class="results-section">
        <Results :results="searchResults" :searchType="searchType" :searchData="searchData" />
      </div>
    </div>
    <Search404 v-else :errors="validationErrors" />
  </div>
</template>

<style lang="scss" scoped>
.search-view {
  background: white;
  padding-top: 200px;

  @media (max-width: $breakpoint-mobile) {
    padding-top: 170px;
  }
}

.results-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 0;

  @media (max-width: $breakpoint-mobile) {
    padding: 0;
  }
}
</style>
