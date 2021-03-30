<template>
  <g>
    <g v-html="svg" />
    <selected-entities
      v-if="hoveredEntities.length > 0"
      :entities="hoveredEntities"
    />
  </g>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
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
};
</script>
