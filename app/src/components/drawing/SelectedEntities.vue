<template>
  <g>
    <component
      :is="entity.tag"
      v-for="entity, i in svg"
      :key="i"
      v-bind="entity.attributes"
      @mouseover="hover(i)"
      @mouseout="unhover(i)"
    >
      <template v-if="entity.tag === 'g'">
        <component
          :is="node.tag"
          v-for="(node, j) in entity.nodes"
          v-bind="node.attributes"
          :key="`${i}_${j}`"
        />
      </template>
    </component>
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
    hoverEvents: { type: Boolean, default: false },
  },
  computed: {
    svg() {
      return this.entities.map((entity) => render(entity, 'svg', {
        output: 'js',
        style: {
          stroke: {
            color: this.stroke,
            width: this.strokeWidth,
          },
          fill: {
            color: this.fill,
          },
          annotation: {
            color: this.stroke,
          },
        },
      }));
    },
  },
  methods: {
    hover(index) {
      if (this.hoverEvents) {
        this.$emit('hover', index);
      }
    },
    unhover(index) {
      if (this.hoverEvents) {
        this.$emit('unhover', index);
      }
    },
  },
};
</script>
