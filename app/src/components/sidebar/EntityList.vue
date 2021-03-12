<template>
  <div class="sidebar-section">
    <h2>Entities</h2>
    <div
      v-for="(entity, i) in entities"
      :key="i"
      class="sidebar-list-item"
      @mouseover="hover(i)"
      @mouseout="unhover(i)"
    >
      {{ entity.type }}
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';


export default {
  name: 'EntityList',
  computed: {
    ...mapState(['hovered']),
    ...mapGetters(['entities']),
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
