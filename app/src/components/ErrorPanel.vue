<template>
  <div v-show="message" class="error-panel">
    <div class="header"><h2>Errors</h2></div>
    <pre class="error">{{ message }}</pre>
  </div>
</template>

<script>
export default {
  name: 'ErrorPanel',
  props: {
    errors: {
      default: () => {},
      type: Object,
    },
  },
  computed: {
    message() {
      if (!this.errors) return '';
      return this.errors.message;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '../assets/styles/variables.scss';

  .error-panel {
    .header {
      padding: .5rem 1rem;
      border-top: $border-sm solid $color-gray-03;
      border-bottom: $border-sm solid $color-gray-03;
      h2 {
        margin: 0rem;
      }
    }
    .error {
      padding: 1rem;
      font-size: 14px;
      font-family: $font-monospace;
      color: $color-red;
      overflow: auto;
    }
  }
</style>
