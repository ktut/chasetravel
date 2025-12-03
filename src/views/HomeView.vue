<script lang="ts">
import TabNavigation from '@/components/TabNavigation.vue'
import SearchWidget from '@/components/SearchWidget.vue'

export default {
  name: 'HomeView',
  components: {
    TabNavigation,
    SearchWidget
  },
  data() {
    return {
      title: 'Chase Sapphire Reserve',
      activeTab: 'overview',
      isLoaded: false
    }
  },
  methods: {
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
  <div class="parallax-master-container">
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
    <!-- Search widget positioned outside parallax group for proper fixed positioning -->
    <div class="search-section desktop">
      <SearchWidget class="search-widget-align" />
    </div>
    <div class="parallax__group search-middle-group">
      <div class="search-section mobile">
        <SearchWidget class="search-widget-align" />
      </div>
      <div class="search">
        <!-- The Edit Section with Tab Navigation -->
        <div class="the-edit-section">
          <h2 class="section-title">Explore <span class="section-title-highlight">The Edit</span> by Chase Travel</h2>
          <p class="section-description">A curated collection of luxury properties from around the world. We hand-select each property to ensure the highest level of quality and service.</p>
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
            <p>Coming soon: Explore our carefully selected collections of exceptional properties.</p>
          </div>

          <!-- Featured Properties Tab Content -->
          <div v-if="activeTab === 'featured-properties'" class="tab-content">
            <p>Coming soon: Browse our featured luxury properties worldwide.</p>
          </div>
        </div>
        
        <!-- Disclaimer Footer -->
        <footer class="disclaimer-footer">
          <div class="disclaimer-content">
            <strong>Disclaimer:</strong> Per JPMC confidentiality policies, no internal information or tooling was used in any way on this project. Everything you see here was created solely based on observations of the original public-facing product.
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.parallax-master-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;

  perspective: 1px;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;

  /* WebKit overflow scrolling fix */
  -webkit-overflow-scrolling: touch;
  height:  calc(100dvh + 15rem);
  @media (max-width: $breakpoint-mobile) {
    height:  calc(100dvh + 10rem);
  }
}

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
  transition: height 1s cubic-bezier(0.8, -0.4, 0.5, 1);
  height: 120vh;
  &.loaded {
    height: 115vh;
  }
  @media (max-width: $breakpoint-mobile) {
    height: 88vh;
    &.loaded {
      height: 80vh;
    }
  }
}

.search-middle-group {
  margin-top: -5rem !important;
}

.search-section {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .search-widget-align {
    margin-top: -16rem;
  }
  &.desktop {
    display: flex;
    justify-content: center;
    align-items: center;
    .search-widget {
      background: rgba(255, 255, 255, 0.95);
    }
  }
  &.mobile {
    display: none;
    .search-widget {
    background: rgba(255, 255, 255, 1);
    }
  }
  @media (max-width: $breakpoint-mobile) {
    &.desktop {
      display: none;
    }
    &.mobile {
      display: block;
      position: relative;
      top: unset;
      bottom: unset;
      right: unset;
      width: 100%;
      max-width: unset;
        .search-widget-align {
          max-width: unset;
          margin-top: unset;
        }
    }
  }
}

.search {
  padding: $spacing-lg;
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
  left: -5px;
  // corrects for perspective issues on left side, otherwise leaves white gap
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
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  margin-top: $spacing-xl;
  padding-top: $spacing-xl;
  border-top: 1px solid #e0e0e0;
  min-height: 100vh;

  .section-title {
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: $spacing-md;
    color: #000;
    .section-title-highlight {
      color: $color-accent;
    }
  }

  .section-description {
    margin-bottom: $spacing-xl;
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
        margin-bottom: $spacing-sm;
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

/* Disclaimer Footer */
  .disclaimer-footer {
    padding: 2rem 0 20rem;
  }

.disclaimer-content {
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  background: #faf8f3;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  padding-left: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.disclaimer-content::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #ff6b35;
  border-radius: 8px 0 0 8px;
}

.disclaimer-content strong {
  font-weight: 700;
}

@media (max-width: $breakpoint-mobile) {
  .disclaimer-footer {
    padding: 0 0 1rem;
  }
  
  .disclaimer-content {
    font-size: 13px;
    padding: 0.875rem 1.25rem;
    padding-left: 1.75rem;
  }
}
</style>
