<template>
  <div class="sidebar-section">
    <h2>Entities</h2>
    <div v-if="entities">
      <div
        v-for="(entity, i) in entityTypes"
        :key="i"
        class="sidebar-list-item hoverable"
        :class="{ hovered: isHovered(i) || isSelected(i) }"
        @mouseover="hover(i)"
        @mouseout="unhover(i)"
        @click.stop="select(i)"
      >
        <div>{{ entity }}</div>
        <entity-details
          v-if="isSelected(i)"
          :details="details(i)"
        />
      </div>
    </div>
    <div v-else class="sidebar-list-item no-content" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import EntityDetails from './EntityDetails.vue';
import entityDetails from '../../utility/entity-details.js';


export default {
  name: 'EntitiesList',
  components: {
    EntityDetails,
  },
  computed: {
    ...mapState(['currentFile', 'hovered', 'selected']),
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
    ...mapMutations(['hoverEntity', 'unhoverEntity', 'setSelected']),
    hover(index) {
      this.hoverEntity(index);
    },
    unhover(index) {
      this.unhoverEntity(index);
    },
    isHovered(index) {
      return this.hovered[index];
    },
    select(index) {
      this.setSelected({ [index]: true });
    },
    isSelected(index) {
      return this.selected[index];
    },
    details(index) {
      const entity = this.entities[index];
      const type = this.entityTypes[index];
      return entityDetails[type](entity);
    },
  },
};
</script>
