<script lang="ts">
import NavBar from '@/components/NavBar.vue'
import TabNavigation from '@/components/TabNavigation.vue'
import SearchWidget from '@/components/SearchWidget.vue'
import Results from '@/components/Results.vue'
import { getMockFlightResults } from '@/services/MockFlightResults'
import { getMockHotelResults } from '@/services/MockHotelResults'

export default {
  name: 'HomeView',
  components: {
    NavBar,
    TabNavigation,
    SearchWidget,
    Results
  },
  data() {
    return {
      title: 'Chase Sapphire Reserve',
      activeSection: 'search' as 'search' | 'results',
      searchResults: [] as any[],
      searchType: 'flights' as 'flights' | 'hotels',
      showResults: false,
      activeTab: 'overview',
      isLoaded: false
    }
  },
  methods: {
    handleSearchSubmitted(searchData: any) {
      console.log('Search submitted:', searchData)

      // Get mock results based on search type
      if (searchData.searchType === 'flights') {
        this.searchResults = getMockFlightResults(searchData)
        this.searchType = 'flights'
      } else if (searchData.searchType === 'hotels') {
        this.searchResults = getMockHotelResults(searchData)
        this.searchType = 'hotels'
      }

      // Show results
      this.showResults = true

      // Smooth scroll to results after a short delay to ensure DOM update
      this.$nextTick(() => {
        const resultsElement = this.$refs.resultsSection as HTMLElement
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    },
    handleTabChange(tabId: string) {
      this.activeTab = tabId
    }
  },
  mounted() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 100);
  }
}
</script>

<template>
  <NavBar />
  <!-- <h1 class="image-top-group-title">Your most rewarding trips start here.</h1> -->
    <div class="parallax__group image-top-group" :class="{ 'loaded': isLoaded }">
      <div class="parallax__layer parallax__layer--back">
        <img
          src="@/assets/g0.png"
          srcset="@/assets/g0-lo.png 480w, @/assets/g0.png 1920w"
          sizes="(max-width: 768px) 480px, 1920px"
          alt="Background layer"
        />
      </div>
      <div class="parallax__layer parallax__layer--base">
        <img
          src="@/assets/g1.png"
          srcset="@/assets/g1-lo.png 480w, @/assets/g1.png 1920w"
          sizes="(max-width: 768px) 480px, 1920px"
          alt="Middle layer"
        />
      </div>
      <div class="parallax__layer parallax__layer--fore">
        <img
          src="@/assets/g2.png"
          srcset="@/assets/g2-lo.png 480w, @/assets/g2.png 1920w"
          sizes="(max-width: 768px) 480px, 1920px"
          alt="Foreground layer"
        />
      </div>
    </div>
    <div class="parallax__group">
      <div class="search">
        <div class="search-section">
          <SearchWidget @search-submitted="handleSearchSubmitted" />
        </div>
        <br></br>

        <div v-if="showResults" ref="resultsSection" class="results-section">
          <Results :results="searchResults" :searchType="searchType" />
        </div>
        <br></br>

        <!-- The Edit Section with Tab Navigation -->
        <div class="the-edit-section">
          <h2 class="section-title">The Edit by Chase Travel</h2>
          <TabNavigation @tab-change="handleTabChange" />

          <!-- Overview Tab Content -->
          <div v-if="activeTab === 'overview'" class="tab-content">
            <div class="benefit-card">
              <div class="benefit-image">
                <img src="@/assets/placeholder-hotel1.png" alt="Four Seasons Resort Napa Valley" />
              </div>
              <div class="benefit-content">
                <h3>Complimentary benefits</h3>
                <p class="property-name">Four Seasons Resort and Residences Napa Valley</p>
                <ul class="benefits-list">
                  <li>Daily breakfast for 2</li>
                  <li>$100 property credit</li>
                  <li>Room upgrades</li>
                  <li>Early check-in/late check-out availability</li>
                </ul>
              </div>
            </div>

            <div class="benefit-card">
              <div class="benefit-image">
                <img src="@/assets/placeholder-hotel2.png" alt="InterContinental London Park Lane" />
              </div>
              <div class="benefit-content">
                <h3>Points redemption</h3>
                <p class="property-name">InterContinental London Park Lane</p>
                <p>Use your Chase Ultimate Rewards points to pay for your stay at exclusive properties.</p>
              </div>
            </div>

            <div class="benefit-card">
              <div class="benefit-image">
                <img src="@/assets/placeholder-hotel3.png" alt="The Hotel Maria Finland" />
              </div>
              <div class="benefit-content">
                <h3>Exploration</h3>
                <p class="property-name">The Hotel Maria, Finland</p>
                <p>Discover diverse property types ranging from mountain retreats in Aspen to high-design boutique hotels in London.</p>
              </div>
            </div>
          </div>

          <!-- Curated Collections Tab Content -->
          <div v-if="activeTab === 'curated-collections'" class="tab-content">
            <p>Explore our carefully selected collections of exceptional properties.</p>
          </div>

          <!-- Featured Properties Tab Content -->
          <div v-if="activeTab === 'featured-properties'" class="tab-content">
            <p>Browse our featured luxury properties worldwide.</p>
          </div>
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>

.image-top-group-title {
  display: none;
  @media (max-width: $breakpoint-mobile) {
    display: block;
    position: absolute;
    top: 13.2rem;
    left: 0;
    right: 0;
    width: 100%;
    text-align: center;
    padding: 0 $spacing-sm;
    z-index: 1;
    text-wrap: balance;
    color: rgba(255, 255, 255, 0.9);
    filter: drop-shadow(-5px 0 10px rgba(0, 0, 0, 1));
    font-size: 2.4rem;
    letter-spacing: unset;
    line-height: 1;
  }
}

.image-top-group {
  height: 85vh;
  transition: height 1s cubic-bezier(0.8, -0.4, 0.5, 1);
  &.loaded {
    height: 75vh;
  }
}

.search-section {
  max-width: 900px;
  margin: -3rem auto 0;
  @media (max-width: $breakpoint-mobile) {
    margin-top: -3rem;
  }
}

.search {
  padding: $spacing-xl;
  margin: 0 auto;
  background: rgba(255, 255, 255, 1);

  .logo {
    max-width: 300px;
    height: auto;
    margin-bottom: $spacing-lg;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 400;
    margin-bottom: $spacing-lg;
    color: #000;
  }

  .content-section {
    margin-top: $spacing-xl;

    .section {
      animation: fadeIn 0.3s ease-in;

      h2 {
        color: $color-accent;
        font-size: 2rem;
        margin-bottom: $spacing-md;
      }

      p {
        font-size: 1.125rem;
        color: $color-text-light;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.parallax__group {
  position: relative;
  transform-style: preserve-3d;
  max-width: $breakpoint-max;
  margin: 0 auto;
}

.parallax__layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

/* Bottom layer - fixed background (g0.svg) */
.parallax__layer--back {
  transform: translateZ(-2px) scale(3);
  z-index: 1;
}

/* Middle layer - slow scroll (g1.svg) */
.parallax__layer--base {
  transform: translateZ(-1px) scale(2);
  z-index: 2;
}

/* Top layer - faster scroll (g2.svg) */
.parallax__layer--fore {
  transform: translateZ(-0.5px) scale(1.5);
  z-index: 3;
}

/* The Edit Section */
.the-edit-section {
  margin-top: $spacing-xl * 2;
  padding-top: $spacing-xl * 2;
  border-top: 1px solid #e0e0e0;

  .section-title {
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: $spacing-xl;
    color: #000;
  }

  .tab-content {
    margin-top: $spacing-xl;
  }

  .benefit-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-xl;
    margin-bottom: $spacing-xl * 2;
    align-items: center;

    @media (max-width: $breakpoint-mobile) {
      grid-template-columns: 1fr;
      gap: $spacing-md;
    }

    &:nth-child(even) {
      .benefit-image {
        order: 2;
      }
      .benefit-content {
        order: 1;
      }

      @media (max-width: $breakpoint-mobile) {
        .benefit-image {
          order: 1;
        }
        .benefit-content {
          order: 2;
        }
      }
    }

    .benefit-image {
      width: 100%;
      overflow: hidden;
      border-radius: 8px;

      img {
        width: 100%;
        height: auto;
        display: block;
        object-fit: cover;
        aspect-ratio: 16 / 10;
      }
    }

    .benefit-content {
      h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: $spacing-sm;
        color: #000;
      }

      .property-name {
        font-size: 1.125rem;
        font-weight: 500;
        margin-bottom: $spacing-md;
        color: #333;
      }

      p {
        font-size: 1rem;
        line-height: 1.6;
        color: #666;
        margin-bottom: $spacing-sm;
      }

      .benefits-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          font-size: 1rem;
          color: #666;
          padding: $spacing-xs 0;
          position: relative;
          padding-left: $spacing-md;

          &::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #0066cc;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
