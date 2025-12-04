<script lang="ts">
export default {
  name: 'Footer'
}
</script>

<template>
  <footer class="disclaimer-footer">
    <div class="disclaimer-content">
      <strong>Disclaimer:</strong> Per JPMC confidentiality policies, no internal information or tooling was used in any way on this project. Everything you see here was created solely based on observations of the original public-facing product.
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.disclaimer-footer {
  padding: 2rem 0;
  background: rgba(255, 255, 255, 1);
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

@media (max-width: 768px) {
  .disclaimer-footer {
    padding: 2rem 1rem;
  }
  
  .disclaimer-content {
    font-size: 13px;
    padding: 0.875rem 1.25rem;
    padding-left: 1.75rem;
  }
}
</style>

