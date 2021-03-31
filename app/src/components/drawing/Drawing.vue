<template>
  <g>
    <g v-html="svg" />
    <selected-entities
      v-if="hoveredEntities.length > 0"
      :entities="hoveredEntities"
    />
    <selected-entities
      :entities="entities"
      :hover-events="true"
      :click-events="true"
      stroke="transparent"
      stroke-width="10px"
      fill="transparent"
      @hover="hover"
      @unhover="unhover"
      @click-entity="select"
    />
  </g>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
import SelectedEntities from './SelectedEntities.vue';


export default {
  name: 'Drawing',
  components: {
    SelectedEntities,
  },
  computed: {
    ...mapState(['hovered', 'selected']),
    ...mapGetters(['svg', 'entities']),
    hoveredEntities() {
      const hoveredOrSelected = {
        ...this.hovered,
        ...this.selected,
      };
      return Object.keys(hoveredOrSelected).map((index) => this.entities[index]);
    },
  },
  methods: {
    ...mapMutations(['hoverEntity', 'unhoverEntity', 'setSelected']),
    hover(index) {
      this.hoverEntity(index);
    },
    unhover(index) {
      this.unhoverEntity(index);
    },
    select(index) {
      this.setSelected({ [index]: true });
    },
    isSelected(index) {
      return this.selected[index];
    },
  },
};
</script>
