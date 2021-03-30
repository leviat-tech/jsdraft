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
import { render } from '../../../../dist/draft.js';


export default {
  name: 'SelectedEntities',
  props: {
    entities: { type: Array, default: () => [] },
    stroke: { type: String, default: '#3D95F0' },
    strokeWidth: { type: String, default: '2px' },
    fill: { type: String, default: 'none' },
  },
  computed: {
    svg() {
      return this.entities.map((entity) => render(entity, 'svg', {
        stroke: {
          color: this.stroke,
          width: this.strokeWidth,
        },
        fill: {
          color: this.fill,
        },
      }));
    },
  },
};
</script>
