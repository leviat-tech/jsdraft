<template>
  <g>
    <g v-html="svg" />
    <selected
      :entities="hoveredEntities"
    />
  </g>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Selected from './Selected.vue';


export default {
  name: 'Drawing',
  components: {
    Selected,
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
