<script lang="ts">
export default {
  name: 'SearchTypeToggle',
  props: {
    modelValue: {
      type: String,
      required: true,
      default: 'flights'
    }
  },
  emits: ['update:modelValue'],
  methods: {
    selectType(type: string) {
      this.$emit('update:modelValue', type)
    }
  }
}
</script>

<template>
  <div class="search-type-toggle">
    <div class="toggle-switch">
      <button
        :class="['toggle-option', { active: modelValue === 'flights' }]"
        @click="selectType('flights')"
        aria-label="Search flights"
      >
        <svg
          :class="['toggle-icon', 'flight-icon', { active: modelValue === 'flights' }]"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Plane body and wings -->
          <path
            class="icon-path plane-body"
            d="M24 16L16 13L16 8C16 7.44772 15.5523 7 15 7C14.4477 7 14 7.44772 14 8L14 13L6 16L6 17.5L14 15.5L14 20L11.5 21.5L11.5 22.5L15 21.5L18.5 22.5L18.5 21.5L16 20L16 15.5L24 17.5L24 16Z"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <!-- Landing gear wheels (visible when not active) -->
          <g class="landing-gear">
            <circle cx="13" cy="23" r="0.8" fill="currentColor" />
            <circle cx="17" cy="23" r="0.8" fill="currentColor" />
            <line x1="13" y1="22" x2="13" y2="20.5" stroke="currentColor" stroke-width="0.8" />
            <line x1="17" y1="22" x2="17" y2="20.5" stroke="currentColor" stroke-width="0.8" />
          </g>
          <!-- Clouds (visible when active) -->
          <g class="clouds">
            <!-- Cloud 1 - left side -->
            <path class="cloud-1"
                  d="M7 24.5 C6.5 24.5 6 24 6 23.5 C6 23.2 6.2 23 6.4 22.8 C6.3 22.6 6.2 22.3 6.2 22 C6.2 21.2 6.8 20.5 7.5 20.5 C7.7 19.7 8.4 19 9.3 19 C10 19 10.6 19.4 10.9 20 C11.1 19.9 11.3 19.8 11.6 19.8 C12.5 19.8 13.2 20.5 13.2 21.4 C13.2 21.5 13.2 21.6 13.2 21.7 C13.6 21.9 13.8 22.3 13.8 22.8 C13.8 23.5 13.3 24 12.7 24 C12.6 24.3 12.4 24.5 12 24.5 Z"
                  fill="currentColor"
                  opacity="0.4"/>
            <!-- Cloud 2 - right side -->
            <path class="cloud-2"
                  d="M18 26 C17.4 26 17 25.6 17 25.2 C17 25 17.1 24.8 17.2 24.7 C17 24.5 16.8 24.2 16.8 23.8 C16.8 23.2 17.2 22.7 17.8 22.5 C17.9 21.8 18.5 21.2 19.2 21.2 C19.5 21.2 19.8 21.3 20 21.5 C20.2 20.8 20.8 20.3 21.5 20.3 C22.3 20.3 23 20.9 23.1 21.7 C23.3 21.6 23.5 21.6 23.7 21.6 C24.5 21.6 25.2 22.3 25.2 23.1 C25.2 23.3 25.2 23.5 25.1 23.7 C25.6 24 25.9 24.5 25.9 25.1 C25.9 25.7 25.5 26.2 25 26.4 C24.8 26.6 24.5 26.8 24.2 26.8 C24 26.8 23.8 26.7 23.6 26.6 C23.4 26.9 23.1 27 22.7 27 C22.5 27 22.3 27 22.1 26.9 C21.8 26.9 21.6 27 21.3 27 C20.7 27 20.2 26.6 20 26.2 C19.7 26.5 19.3 26.7 18.8 26.7 C18.5 26.7 18.2 26.5 18 26 Z"
                  fill="currentColor"
                  opacity="0.35"/>
            <!-- Cloud 3 - small accent cloud -->
            <ellipse class="cloud-3" cx="15" cy="24.5" rx="2" ry="1.2" fill="currentColor" opacity="0.25"/>
          </g>
        </svg>
        <span class="toggle-label">Flights</span>
      </button>
      <button
        :class="['toggle-option', { active: modelValue === 'hotels' }]"
        @click="selectType('hotels')"
        aria-label="Search stays"
      >
        <svg
          :class="['toggle-icon', 'hotel-icon', { active: modelValue === 'hotels' }]"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Main building -->
          <rect
            class="icon-path building"
            x="10"
            y="7"
            width="12"
            height="18"
            rx="1"
            stroke="currentColor"
            stroke-width="1.25"
          />
          <!-- Awning/entrance -->
          <rect
            class="icon-path awning"
            x="10"
            y="11"
            width="12"
            height="2"
            fill="currentColor"
            opacity="0.3"
          />
          <!-- Windows grid -->
          <rect class="icon-path window" x="12.5" y="14" width="2" height="2" rx="0.3" fill="currentColor"/>
          <rect class="icon-path window" x="17.5" y="14" width="2" height="2" rx="0.3" fill="currentColor"/>
          <rect class="icon-path window" x="12.5" y="17.5" width="2" height="2" rx="0.3" fill="currentColor"/>
          <rect class="icon-path window" x="17.5" y="17.5" width="2" height="2" rx="0.3" fill="currentColor"/>
          <rect class="icon-path window" x="12.5" y="21" width="2" height="2" rx="0.3" fill="currentColor"/>
          <rect class="icon-path window" x="17.5" y="21" width="2" height="2" rx="0.3" fill="currentColor"/>
          <!-- Door -->
          <rect
            class="icon-path door"
            x="14"
            y="23"
            width="4"
            height="2"
            rx="0.3"
            stroke="currentColor"
            stroke-width="1"
            fill="none"
          />
          <!-- Left palm tree -->
          <g class="icon-path palm-left">
            <line x1="6" y1="25" x2="6" y2="18" stroke="currentColor" stroke-width="1"/>
            <path d="M6 18 C4 17, 3 16, 3 15" stroke="currentColor" stroke-width="1" fill="none"/>
            <path d="M6 18 C5 16.5, 4.5 15, 4.5 14" stroke="currentColor" stroke-width="1" fill="none"/>
            <path d="M6 18 C8 17, 9 16, 9 15" stroke="currentColor" stroke-width="1" fill="none"/>
            <path d="M6 18 C7 16.5, 7.5 15, 7.5 14" stroke="currentColor" stroke-width="1" fill="none"/>
          </g>
          <!-- Right palm tree -->
          <g class="icon-path palm-right">
            <line x1="26" y1="25" x2="26" y2="18" stroke="currentColor" stroke-width="1"/>
            <path d="M26 18 C24 17, 23 16, 23 15" stroke="currentColor" stroke-width="1" fill="none"/>
            <path d="M26 18 C25 16.5, 24.5 15, 24.5 14" stroke="currentColor" stroke-width="1" fill="none"/>
            <path d="M26 18 C28 17, 29 16, 29 15" stroke="currentColor" stroke-width="1" fill="none"/>
            <path d="M26 18 C27 16.5, 27.5 15, 27.5 14" stroke="currentColor" stroke-width="1" fill="none"/>
          </g>
          <!-- Base/pool -->
          <ellipse
            class="icon-path pool"
            cx="16"
            cy="26"
            rx="10"
            ry="1.5"
            fill="currentColor"
            opacity="0.2"
          />
        </svg>
        <span class="toggle-label">Stays</span>
      </button>
      <div class="toggle-slider" :class="{ 'slide-right': modelValue === 'hotels' }"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-type-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -3.5rem;
  margin-bottom: 24px;

  .toggle-switch {
    position: relative;
    display: inline-flex;
    background: linear-gradient(145deg, #f5f5f5, #e8e8e8);
    border-radius: 2.5rem;
    padding: 4px;
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.06),
      0 1px 2px rgba(0, 0, 0, 0.05);
    min-width: 260px;
  }

  .toggle-option {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 20px;
    border: none;
    background: transparent;
    border-radius: 2rem;
    cursor: pointer;
    transition: color 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
    white-space: nowrap;
    color: #888;
    font-weight: 500;
    font-size: 15px;
    letter-spacing: 0.2px;
    flex: 1;
    min-width: 0;

    &:hover:not(.active) {
      color: #555;
    }

    &.active {
      color: $color-text;

      .toggle-label {
        font-weight: 600;
      }
    }

    .toggle-label {
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
    }
  }

  .toggle-icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    transform-origin: center;
    color: #888;
    transition: color 0.35s cubic-bezier(0.4, 0, 0.2, 1);

    .icon-path {
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &.active {
      color: $color-accent;

      .icon-path {
        animation: luxuryPulse 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
    }

    // Flight icon - plane rotates with gear retracting
    &.flight-icon {
      .landing-gear {
        opacity: 1;
        transition: opacity 0.3s ease;
      }

      .clouds {
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .plane-body {
        transform-origin: center;
        transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      &.active {
        .plane-body {
          animation: planeRotateUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .landing-gear {
          animation: gearRetract 0.4s ease-out 0.2s forwards;
        }

        .clouds {
          opacity: 1;
        }

        .cloud-1 {
          animation: cloudDrift1 0.6s ease-out 0.3s backwards;
        }

        .cloud-2 {
          animation: cloudDrift2 0.7s ease-out 0.4s backwards;
        }

        .cloud-3 {
          animation: cloudDrift3 0.5s ease-out 0.35s backwards;
        }
      }
    }

    // Hotel icon - simple door open animation
    &.hotel-icon.active {
      .door {
        animation: doorSwingOpen 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
    }
  }

  .toggle-slider {
    position: absolute;
    top: 4px;
    left: 4px;
    height: calc(100% - 8px);
    width: calc(50% - 4px);
    background: linear-gradient(145deg, #ffffff, #fafafa);
    border-radius: 2rem;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow:
      0 3px 12px rgba(0, 0, 0, 0.12),
      0 1px 4px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    z-index: 0;

    &.slide-right {
      transform: translateX(calc(100%));
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 2rem;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
      pointer-events: none;
    }
  }

  // Flight animations
  @keyframes planeRotateUp {
    0% {
      transform: rotate(0deg) translateY(0);
    }
    100% {
      transform: rotate(-18deg) translateY(-3px);
    }
  }

  @keyframes gearRetract {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-3px);
    }
  }

  // Cloud animations - drift in from different directions
  @keyframes cloudDrift1 {
    0% {
      opacity: 0;
      transform: translateX(-8px) translateY(2px);
    }
    100% {
      opacity: 0.4;
      transform: translateX(0) translateY(0);
    }
  }

  @keyframes cloudDrift2 {
    0% {
      opacity: 0;
      transform: translateX(10px) translateY(-2px);
    }
    100% {
      opacity: 0.35;
      transform: translateX(0) translateY(0);
    }
  }

  @keyframes cloudDrift3 {
    0% {
      opacity: 0;
      transform: translateX(-5px) scale(0.7);
    }
    100% {
      opacity: 0.25;
      transform: translateX(0) scale(1);
    }
  }

  // Hotel animation - simple door swing open
  @keyframes doorSwingOpen {
    0% {
      transform: scaleY(0.3);
      transform-origin: bottom;
      opacity: 0.6;
    }
    60% {
      transform: scaleY(1.05);
      transform-origin: bottom;
      opacity: 1;
    }
    100% {
      transform: scaleY(1);
      transform-origin: bottom;
      opacity: 1;
    }
  }

  @media (max-width: $breakpoint-mobile) {
    .toggle-switch {
      min-width: 240px;
    }

    .toggle-option {
      padding: 6px 16px;
      gap: 6px;
      font-size: 14px;
    }

    .toggle-icon {
      width: 28px;
      height: 28px;
    }
  }
}
</style>

