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
import range from 'lodash/range';


export default {
  name: 'Grid',
  props: {
    viewBox: { type: Object, required: true },
  },
  data() {
    return {
      stepSize: 10,
      minX: -200,
      maxX: 200,
      minY: -200,
      maxY: 200,
    };
  },
  computed: {
    width() {
      return this.maxX - this.minY;
    },
    height() {
      return this.maxY - this.minY;
    },
    hLines() {
      const minMod = this.minY % this.stepSize;
      const min = this.minY - minMod;

      const maxMod = this.maxY % this.stepSize;
      const max = this.maxX - maxMod;

      const eMin = min - (max - min) * 2;
      const eMax = max + (max - min) * 2;
      return range(eMin, eMax + this.stepSize, this.stepSize).map((y) => {
        const pt0 = { x: this.minX - (this.width) * 2, y };
        const pt1 = { x: this.maxX + (this.width) * 2, y };
        return { pt0, pt1 };
      });
    },
    vLines() {
      const minMod = this.minX % this.stepSize;
      const min = this.minX - minMod;

      const maxMod = this.maxX % this.stepSize;
      const max = this.maxX - maxMod;

      const eMin = min - (max - min) * 2;
      const eMax = max + (max - min) * 2;
      return range(eMin, eMax + this.stepSize, this.stepSize).map((x) => {
        const pt0 = { x, y: this.minY - (this.height) * 2 };
        const pt1 = { x, y: this.maxY + (this.height) * 2 };
        return { pt0, pt1 };
      });
    },
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
