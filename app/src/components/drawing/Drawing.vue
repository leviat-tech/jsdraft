<template>
  <g>
    <g v-html="svg" />
    <selected-entities
      v-if="selectedEntities.length > 0"
      :entities="selectedEntities"
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
    selectedEntities() {
      const selected = Object.keys(this.selected);
      if (this.hovered !== null) selected.push(this.hovered);

      return selected.map((index) => this.entities[index]);
    },
  },
  methods: {
    ...mapMutations(['setHovered', 'setSelected']),
    hover(index) {
      this.setHovered(index);
    },
    unhover() {
      this.setHovered(null);
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
