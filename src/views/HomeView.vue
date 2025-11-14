<script lang="ts">
import NavBar from '@/components/NavBar.vue'
import TabNavigation from '@/components/TabNavigation.vue'
import Calendar from '@/components/Calendar.vue'

export default {
  name: 'SearchView',
  components: {
    NavBar,
    TabNavigation,
    Calendar
  },
  data() {
    return {
      title: 'Chase Sapphire Reserve',
      activeSection: 'overview'
    }
  },
  methods: {
    handleTabChange(tabId: string) {
      this.activeSection = tabId
    },
    handleDateRangeSelected(dateRange: { checkIn: Date | null, checkOut: Date | null }) {
      console.log('Date range selected:', dateRange)
    }
  }
}
</script>

<template>
  <NavBar />

  <div class="parallax__group">
    
    <div class="parallax__group">
      <div class="parallax__layer parallax__layer--back">
        <img src="@/assets/g0.png" alt="Background layer" />
      </div>
      <div class="parallax__layer parallax__layer--base">
        <img src="@/assets/g1.png" alt="Middle layer" />
      </div>
      <div class="parallax__layer parallax__layer--fore">
        <img src="@/assets/g2.png" alt="Foreground layer" />

        <div class="search">
          <img src="/chase-travel-logo-white.svg" alt="Chase Travel" class="logo" />
          <h1>Discover The Edit by Chase Travel℠</h1>
          <div class="search-section">
            <Calendar @date-range-selected="handleDateRangeSelected" />
          </div>
          <br></br>

          <div class="flight-results-section">Results go here</div>
          <br></br>

          <TabNavigation @tab-change="handleTabChange" />
          <div class="content-section">
            <div v-if="activeSection === 'overview'" class="section">
              <h2>Premium Travel Rewards</h2>
              <p>Experience luxury travel with exclusive benefits and rewards.</p>
            </div>

            <div v-if="activeSection === 'curated-collections'" class="section">
              <h2>Curated Collections</h2>
              <p>Explore hand-picked destinations tailored to your travel style.</p>
            </div>

            <div v-if="activeSection === 'featured-properties'" class="section">
              <h2>Featured Properties</h2>
              <p>Discover exceptional hotels and resorts with exclusive benefits.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- REMOVE BELOW DIV AFTER TESTING -->
    <div class="parallax__group">
      <img src="@/assets/guatemala-test-p3.jpg" alt="test p3 image" style="width: 100vw;"/>
      </div>
    
  </div>
</template>

<style lang="scss" scoped>
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

.parallax, .parallax__group {
  height: 90vh;
}

.parallax {
  perspective: 1px;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;

  /* WebKit overflow scrolling fix */
  -webkit-overflow-scrolling: touch;
}

.parallax__group {
  position: relative;
  transform-style: preserve-3d;
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
</style>
