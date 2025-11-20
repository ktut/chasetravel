<script lang="ts">
import SearchWidget from '@/components/SearchWidget.vue'
import SearchTypeToggle from '@/components/SearchTypeToggle.vue'
import PassengerSelector from '@/components/PassengerSelector.vue'
import AmenityPills from '@/components/AmenityPills.vue'

export default {
  name: 'ComponentsView',
  components: {
    SearchWidget,
    SearchTypeToggle,
    PassengerSelector,
    AmenityPills
  },
  data() {
    return {
      searchType: 'flights' as 'flights' | 'hotels' | 'cars' | 'activities' | 'cruises' | 'tours',
      adults: 2,
      children: 1,
      sampleAmenities: [
        'Wi-Fi',
        'Pool',
        'Gym',
        'Parking',
        'Pet Friendly',
        'Breakfast Included',
        'Air Conditioning',
        'Ocean View'
      ],
      sampleInput: '',
      sampleInputWithPlaceholder: '',
      sampleInputWithLabel: '',
      sampleDisabledInput: 'Disabled input value'
    }
  },
  methods: {
    handleAdultsUpdate(count: number) {
      this.adults = count
    },
    handleChildrenUpdate(count: number) {
      this.children = count
    }
  }
}
</script>

<template>
  <div class="components-view">
    <div class="components-container">
      <h1>UI Components Showcase</h1>
      <p class="intro-text">This page displays all UI components used in the application for reference and testing purposes.</p>

      <div class="components-grid">
      <!-- SearchWidget Section -->
      <section class="component-section">
        <div class="component-showcase">
          <SearchWidget />
        </div>
      </section>

      <!-- SearchTypeToggle Section -->
      <section class="component-section">
        <div class="component-showcase">
          <SearchTypeToggle v-model="searchType" />
        </div>
        <p class="component-state">Current selection: <strong>{{ searchType }}</strong></p>
      </section>

      <!-- PassengerSelector Section -->
      <section class="component-section">
        <div class="component-showcase">
          <PassengerSelector
            :adults="adults"
            :children="children"
            :search-type="searchType"
            @update:adults="handleAdultsUpdate"
            @update:children="handleChildrenUpdate"
          />
        </div>
        <p class="component-state">Adults: <strong>{{ adults }}</strong>, Children: <strong>{{ children }}</strong></p>
      </section>

      <!-- AmenityPills Section -->
      <section class="component-section">
        <div class="component-showcase">
          <AmenityPills :amenities="sampleAmenities" />
        </div>
      </section>

      <!-- Buttons Section -->
      <section class="component-section">
        <div class="component-showcase">
          <div class="button-group">
            <div class="button-example">
              <h3>Primary / Main Button</h3>
              <button class="btn-primary">Primary Button</button>
              <button class="btn-primary" disabled>Primary Disabled</button>
            </div>
            <div class="button-example">
              <h3>Secondary Button</h3>
              <button class="btn-secondary">Secondary Button</button>
              <button class="btn-secondary" disabled>Secondary Disabled</button>
            </div>
            <div class="button-example">
              <h3>Tertiary Button</h3>
              <button class="btn-tertiary">Tertiary Button</button>
              <button class="btn-tertiary" disabled>Tertiary Disabled</button>
            </div>
            <div class="button-example">
              <h3>Outlined Button</h3>
              <button class="btn-outline">Outlined Button</button>
              <button class="btn-outline" disabled>Outlined Disabled</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Input Fields Section -->
      <section class="component-section">
        <div class="component-showcase">
          <div class="input-group">
            <div class="input-example">
              <h3>Standard Input</h3>
              <input
                v-model="sampleInput"
                type="text"
                class="sample-input"
                aria-label="Standard input"
              />
              <p class="input-value">Value: {{ sampleInput || '(empty)' }}</p>
            </div>
            <div class="input-example">
              <h3>Input with Placeholder</h3>
              <input
                v-model="sampleInputWithPlaceholder"
                type="text"
                class="sample-input"
                placeholder="Enter text here..."
                aria-label="Input with placeholder"
              />
            </div>
            <div class="input-example">
              <h3>Input with Label</h3>
              <label for="labeled-input" class="input-label">Email Address</label>
              <input
                id="labeled-input"
                v-model="sampleInputWithLabel"
                type="email"
                class="sample-input"
                placeholder="you@example.com"
                aria-label="Email address"
              />
            </div>
            <div class="input-example">
              <h3>Disabled Input</h3>
              <input
                v-model="sampleDisabledInput"
                type="text"
                class="sample-input"
                disabled
                aria-label="Disabled input"
              />
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.components-view {
  min-height: 100vh;
  background: $color-bg;
  padding: $spacing-lg 0;
}

.components-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 7rem $spacing-md;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: $spacing-sm;
  color: $color-text;

  @media (max-width: $breakpoint-mobile) {
    font-size: 2rem;
  }
}

.intro-text {
  font-size: 1.125rem;
  color: $color-text-light;
  margin-bottom: $spacing-xl;
  line-height: 1.6;
}

.components-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-xl;

  @media (min-width: $breakpoint-tablet) {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-xl * 2;
  }
}

.component-section {
  padding-bottom: $spacing-xl;
  border-bottom: 1px solid $color-light-grey;

  &:last-child {
    border-bottom: none;
  }

  .component-state {
    margin-top: $spacing-md;
    font-size: 0.95rem;
    color: $color-text-light;

    strong {
      color: $color-text;
      font-weight: 600;
    }
  }
}

.component-showcase {
  background: white;
  border: 1px solid $color-light-grey;
  border-radius: 8px;
  padding: $spacing-lg;
  margin-top: $spacing-md;

  @media (max-width: $breakpoint-mobile) {
    padding: $spacing-md;
  }
}

.button-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-lg;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }
}

.button-example {
  h3 {
    font-size: 1.125rem;
    margin-bottom: $spacing-md;
    color: $color-text;
    font-weight: 600;
  }

  button {
    margin-right: $spacing-sm;
    margin-bottom: $spacing-sm;
  }
}

.input-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-lg;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }
}

.input-example {
  h3 {
    font-size: 1.125rem;
    margin-bottom: $spacing-sm;
    color: $color-text;
    font-weight: 600;
  }

  .input-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-text;
    margin-bottom: 0.5rem;
  }

  .sample-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    font-size: 16px;
    font-family: $font-body;
    transition: border-color 0.2s;
    background: white;

    &:focus {
      outline: none;
      border-color: $color-accent;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    &:disabled {
      background: $color-bg-light;
      color: $color-text-light;
      cursor: not-allowed;
      opacity: 0.6;
    }

    &::placeholder {
      color: #999;
    }
  }

  .input-value {
    margin-top: $spacing-xs;
    font-size: 0.875rem;
    color: $color-text-light;
    font-style: italic;
  }
}
</style>
