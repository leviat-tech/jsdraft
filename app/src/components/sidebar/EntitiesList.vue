<template>
  <div class="sidebar-section">
    <h2>Entities</h2>
    <div v-if="entities">
      <div
        v-for="(entity, i) in entityTypes"
        :key="i"
        class="sidebar-list-item hoverable"
        @mouseover="hover(i)"
        @mouseout="unhover(i)"
      >
        {{ entity }}
      </div>
    </div>
    <div v-else class="sidebar-list-item no-content" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';


export default {
  name: 'EntitiesList',
  computed: {
    ...mapState(['currentFile']),
    ...mapGetters(['entities']),
    entityTypes() {
      return this.entities
        .map((e) => ({
          Multiline: 'Polycurve',
          Polygon: 'Polyface',
        }[e.constructor.name] || e.constructor.name));
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
