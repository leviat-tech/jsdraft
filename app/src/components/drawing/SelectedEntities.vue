<template>
  <g>
    <component
      :is="entity.tag"
      v-for="entity, i in svg"
      :key="i"
      v-bind="entity.attributes"
      @mouseover="hover(i)"
      @mouseout="unhover(i)"
      @click.stop="click(i)"
    >
      <template v-if="entity.tag === 'g'">
        <template
          v-for="(node, j) in entity.nodes"
          :key="`${i}_${j}`"
        >
          <component
            :is="node.tag"
            v-bind="node.attributes"
            :id="`${nodeId}-${node.tag}-${i}-${j}`"
            @click.stop="clickInput(node, i, j)"
          >
            <template v-if="node.contents">{{ node.contents }}</template>
          </component>
        </template>
      </template>
    </component>
  </g>
</template>

<script>
import { render } from '@crhio/jsdraft';
import { mapMutations, mapState } from 'vuex';


export default {
  name: 'SelectedEntities',
  props: {
    entities: { type: Array, default: () => [] },
    stroke: { type: String, default: '#3D95F0' },
    strokeWidth: { type: String, default: '2px' },
    fill: { type: String, default: 'none' },
    hoverEvents: { type: Boolean, default: false },
    clickEvents: { type: Boolean, default: false },
    nodeId: { type: String, required: true },
  },
  computed: {
    ...mapState(['selectedInput']),
    svg() {
      try {
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
      } catch {
        return [];
      }
    },
  },
  methods: {
    ...mapMutations(['setSelectedInput']),
    hover(index) {
      if (this.hoverEvents) this.$emit('hover', index);
    },
    unhover(index) {
      if (this.hoverEvents) this.$emit('unhover', index);
    },
    click(index) {
      if (this.clickEvents) this.$emit('click-entity', index);
    },
    clickInput(node, entityIndex, nodeIndex) {
      if (this.clickEvents) this.$emit('click-entity', entityIndex);
      if (node.tag !== 'text') return;
      if (!node.callback) return;
      this.setSelectedInput({
        id: `hover-boxes-${node.tag}-${entityIndex}-${nodeIndex}`,
        value: node.contents,
        callback: node.callback,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.invisible {
  color: transparent;
}
</style>
