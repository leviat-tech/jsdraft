<template>
  <div class="statusbar">
    <div class="left">
      <div class="current-point">
        x: <span class="coordinate">{{ pointDisplay.x }}</span>
        y: <span class="coordinate">{{ pointDisplay.y }}</span>
      </div>
      <div class="grid-size">
        Grid line: {{ gridStepSize }} {{ modelUnits }}
      </div>
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
import { mapState, mapGetters } from 'vuex';


function numDisplay(number) {
  const precision = parseFloat(number.toPrecision(4));
  return parseFloat(precision.toFixed(2));
}


export default {
  name: 'Statusbar',
  computed: {
    ...mapState(['currentPoint', 'path', 'gridStepSize']),
    ...mapGetters(['draft']),
    pointDisplay() {
      return {
        x: numDisplay(this.currentPoint.x),
        y: numDisplay(this.currentPoint.y),
      };
    },
    modelUnits() {
      return (this.draft && this.draft.settings.model_unit) || 'mm';
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

  .left {
    display: flex;
    margin-left: 1rem;
    font-size: $text-sm;
  }

  .current-point {
    margin-right: 1rem;
  }

  .coordinate {
    display: inline-block;
    width: 2.5rem;
  }

  .svg {
    height: 0.85rem;
    margin-right: 1rem;
  }
</style>
