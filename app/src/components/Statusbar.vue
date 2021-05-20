<template>
  <div class="statusbar">
    <div class="current-point">
      x: <span class="coordinate">{{ pointDisplay.x }}</span>
      y: <span class="coordinate">{{ pointDisplay.y }}</span>
    </div>
    <div v-if="path">
      <img
        class="svg"
        src="icons/save.svg"
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';


export default {
  name: 'Statusbar',
  computed: {
    ...mapState(['currentPoint', 'path']),
    pointDisplay() {
      return {
        x: Math.round(this.currentPoint.x),
        y: Math.round(this.currentPoint.y),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '../assets/styles/variables.scss';

  .statusbar {
    height: 2rem;
    flex-shrink: 0;
    border-top: $border-sm solid $color-gray-03;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .current-point {
    margin-left: 1rem;
    font-size: $text-sm;
  }

  .coordinate {
    display: inline-block;
    width: 2rem;
  }

  .svg {
    height: 0.85rem;
    margin-right: 1rem;
  }
</style>
