<script lang="ts">
export default {
  name: 'Search404',
  props: {
    errors: {
      type: Array as () => string[],
      default: () => []
    }
  }
}
</script>

<template>
  <div class="search-404">
    <div class="search-404-container">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="error-icon">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>

      <h1>Invalid Search</h1>
      <p class="main-message">
        We couldn't process your search due to invalid or missing parameters.
      </p>

      <div v-if="errors.length > 0" class="error-details">
        <h2>Issues found:</h2>
        <ul>
          <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
      </div>

      <div class="actions">
        <RouterLink to="/" class="btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Start a New Search
        </RouterLink>
        <button @click="$router.back()" class="btn-secondary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Go Back
        </button>
      </div>

      <div class="help-text">
        <p>
          Need help? Make sure your search includes:
        </p>
        <ul class="requirements">
          <li>Valid origin location</li>
          <li>Valid destination (for flights)</li>
          <li>Check-in and check-out dates</li>
          <li>Number of travelers (1-9 adults, 0-9 children)</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-404 {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.search-404-container {
  max-width: 600px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.icon-wrapper {
  .error-icon {
    width: 80px;
    height: 80px;
    color: #dc2626;
    stroke-width: 2;

    @media (max-width: 768px) {
      width: 64px;
      height: 64px;
    }
  }
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.main-message {
  font-size: 1.125rem;
  color: #666;
  margin: 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.error-details {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1.25rem;
  width: 100%;
  text-align: left;

  h2 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.75rem 0;
    color: #991b1b;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    li {
      font-size: 0.9rem;
      color: #dc2626;
      padding-left: 1.25rem;
      position: relative;

      &::before {
        content: '•';
        position: absolute;
        left: 0;
        font-weight: 700;
      }
    }
  }
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;

    svg {
      width: 20px;
      height: 20px;
    }

    @media (max-width: 768px) {
      justify-content: center;
      width: 100%;
    }
  }

  .btn-primary {
    background: #005eb8;
    color: white;
    border: 2px solid #005eb8;

    &:hover {
      background: #004a94;
      border-color: #004a94;
    }
  }

  .btn-secondary {
    background: white;
    color: #005eb8;
    border: 2px solid #005eb8;

    &:hover {
      background: #f0f7ff;
    }
  }
}

.help-text {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.25rem;
  width: 100%;

  p {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 0.75rem 0;
  }

  .requirements {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;

    li {
      font-size: 0.9rem;
      color: #666;
      padding-left: 1.5rem;
      position: relative;

      &::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #0a8a4e;
        font-weight: 700;
      }
    }
  }
}
</style>
