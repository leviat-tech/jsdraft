<template>
  <div class="statusbar" />
</template>

<script>
export default {
  name: 'Statusbar',
};
</script>

<style lang="scss">
  @import '../assets/styles/variables.scss';

  .statusbar {
    height: 2rem;
    border-top: $border-sm solid $color-gray-03;
  }
</style>
