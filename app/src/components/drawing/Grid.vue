<template>
  <g>
    <line
      v-for="({ pt0, pt1 }, i) in hLines"
      :key="`hline_${i}`"
      :x1="pt0.x" :y1="pt0.y"
      :x2="pt1.x" :y2="pt1.y"
      class="grid-line"
    />
    <line
      v-for="({ pt0, pt1 }, i) in vLines"
      :key="`vline_${i}`"
      :x1="pt0.x" :y1="pt0.y"
      :x2="pt1.x" :y2="pt1.y"
      class="grid-line"
    />
    <line
      :x1="minX - width * 2" :y1="0"
      :x2="maxX + width * 2" :y2="0"
      class="axis"
    />
    <line
      :x1="0" :y1="minY - height * 2"
      :x2="0" :y2="maxY + height * 2"
      class="axis"
    />
  </g>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex';
import range from 'lodash/range';
import convertUnits from '../../utility/convert-units.js';


function orderMagnitude(n) {
  const order = Math.floor(Math.log(n) / Math.LN10 + 0.000000001);
  return 10 ** order;
}

export default {
  name: 'Grid',
  props: {
    viewBox: { type: Object, required: true },
  },
  data() {
    return {
      minX: -200,
      maxX: 200,
      minY: -200,
      maxY: 200,
    };
  },
  computed: {
    ...mapState(['gridStepSize', 'zoomScale']),
    ...mapGetters(['extents', 'draft']),
    width() {
      return this.maxX - this.minY;
    },
    height() {
      return this.maxY - this.minY;
    },
    hLines() {
      const minMod = this.minY % this.gridStepSize;
      const min = this.minY - minMod;

      const maxMod = this.maxY % this.gridStepSize;
      const max = this.maxX - maxMod;

      const eMin = min - (max - min) * 2;
      const eMax = max + (max - min) * 2;
      return range(eMin, eMax + this.gridStepSize, this.gridStepSize).map((y) => {
        const pt0 = { x: this.minX - (this.width) * 2, y };
        const pt1 = { x: this.maxX + (this.width) * 2, y };
        return { pt0, pt1 };
      });
    },
    vLines() {
      const minMod = this.minX % this.gridStepSize;
      const min = this.minX - minMod;

      const maxMod = this.maxX % this.gridStepSize;
      const max = this.maxX - maxMod;

      const eMin = min - (max - min) * 2;
      const eMax = max + (max - min) * 2;
      return range(eMin, eMax + this.gridStepSize, this.gridStepSize).map((x) => {
        const pt0 = { x, y: this.minY - (this.height) * 2 };
        const pt1 = { x, y: this.maxY + (this.height) * 2 };
        return { pt0, pt1 };
      });
    },
  },
  watch: {
    extents: {
      immediate: true,
      handler(extents) {
        if (extents) {
          const modelUnit = this.draft.settings.model_unit || 'mm';
          const plotUnit = this.draft.settings.plot_unit || modelUnit;
          const plotSize = this.draft.settings.plot_size || 1000;
          const scale = this.draft.settings.scale || 1;
          const ps = convertUnits(plotSize, plotUnit, modelUnit) / scale;

          const gridStepSize = orderMagnitude(ps / 40);
          const zoomScale = this.gridStepSize / gridStepSize;

          if (this.gridStepSize !== gridStepSize) {
            this.setZoomScale(zoomScale * this.zoomScale);
          }

          this.setGridStepSize(gridStepSize);

          this.minX = -(gridStepSize * 20);
          this.maxX = gridStepSize * 20;
          this.minY = -(gridStepSize * 20);
          this.maxY = gridStepSize * 20;
        }
      },
    },
  },
  methods: {
    ...mapMutations(['setGridStepSize', 'setZoomScale']),
  },
};
</script>

<style lang="scss" scoped>
.grid-line {
  vector-effect: non-scaling-stroke;
  stroke-width: 0.5px;
  stroke: #ccc;
}

.axis {
  vector-effect: non-scaling-stroke;
  stroke-width: 0.5px;
  stroke: #000;
}
</style>
