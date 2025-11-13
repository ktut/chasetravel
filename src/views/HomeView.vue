<script lang="ts">
import TabNavigation from '@/components/TabNavigation.vue'
import Calendar from '@/components/Calendar.vue'

export default {
  name: 'HomeView',
  components: {
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
  <div class="home">
    <img src="/chase-travel-logo-white.svg" alt="Chase Travel" class="logo" />
    <h1>Discover The Edit by Chase Travel℠</h1>
    <TabNavigation @tab-change="handleTabChange" />

    <Calendar @date-range-selected="handleDateRangeSelected" />

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
</template>

<style lang="scss" scoped>
.home {
  padding: $spacing-xl;
  max-width: 1200px;
  margin: 0 auto;

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
</style>
