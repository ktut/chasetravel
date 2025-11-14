<script lang="ts">
import NavBar from '@/components/NavBar.vue'
import TabNavigation from '@/components/TabNavigation.vue'
import SearchWidget from '@/components/SearchWidget.vue'

export default {
  name: 'HomeView',
  components: {
    NavBar,
    TabNavigation,
    SearchWidget
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
    handleSearchSubmitted(searchData: any) {
      console.log('Search submitted:', searchData)
    }
  }
}
</script>

<template>
  <NavBar />
  <h1 class="image-top-group-title">Your most rewarding trips start here.</h1>
    <div class="parallax__group image-top-group">
      <div class="parallax__layer parallax__layer--back">
        <img src="@/assets/g0.png" alt="Background layer" />
      </div>
      <div class="parallax__layer parallax__layer--base">
        <img src="@/assets/g1.png" alt="Middle layer" />
      </div>
      <div class="parallax__layer parallax__layer--fore">
        <img src="@/assets/g2.png" alt="Foreground layer" />
      </div>
    </div>
    <div class="parallax__group">
      <div class="search">
        <div class="search-section">
          <SearchWidget @search-submitted="handleSearchSubmitted" />
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
</template>

<style lang="scss" scoped>

.image-top-group-title {
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -0.02em;
  position: absolute;
  top: 31vh;
  left: 0;
  right: 0;
  width: 100vw;
  text-align: center;
  padding: 0 $spacing-sm;
  z-index: 1;
  text-wrap: balance;
  filter: drop-shadow(-5px 0 10px rgba(0, 0, 0, 1));
  @media (max-width: $breakpoint-mobile) {
    font-size: 1.8rem;
    letter-spacing: unset;
    top: 30vh;
    line-height: 1;
  }
}

.image-top-group {
  height: 90vh;
  @media (max-width: $breakpoint-mobile) {
    height: 80vh;
  }
}

.search-section {
  max-width: 600px;
  margin: -10rem auto 0;
  @media (max-width: $breakpoint-mobile) {
    margin-top: -6rem;
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
</style>
