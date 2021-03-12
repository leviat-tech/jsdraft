<template>
  <g>
    <g
      v-for="entity, i in svg"
      :key="i"
      v-html="entity"
    />
  </g>
</template>

<script>
import { entity_to_svg } from '../../../../dist/draft.js';


export default {
  name: 'Selected',
  props: {
    entities: { type: Array, default: () => [] },
    stroke: { type: String, default: '#3D95F0' },
    strokeWidth: { type: String, default: '2px' },
    fill: { type: String, default: 'none' },
  },
  computed: {
    svg() {
      return this.entities.map((e) => entity_to_svg(e.entity, {
        stroke: this.stroke,
        stroke_width: this.strokeWidth,
        fill: this.fill,
        vector_effect: 'non-scaling-stroke',
      }));
    },
  },
};
</script>
