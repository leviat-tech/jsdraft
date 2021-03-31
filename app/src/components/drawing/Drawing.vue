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
      stroke="transparent"
      fill="transparent"
      @hover="hover"
      @unhover="unhover"
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
    ...mapState(['hovered']),
    ...mapGetters(['svg', 'entities']),
    hoveredEntities() {
      return Object.keys(this.hovered).map((index) => this.entities[index]);
    },
  },
  methods: {
    ...mapMutations(['hoverEntity', 'unhoverEntity']),
    hover(index) {
      this.hoverEntity(index);
    },
    unhover(index) {
      this.unhoverEntity(index);
    },
  },
};
</script>
