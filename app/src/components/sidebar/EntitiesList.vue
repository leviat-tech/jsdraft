<template>
  <div class="sidebar-section">
    <h2>Entities</h2>
    <div v-if="entities">
      <entity-details
        v-for="(entityType, i) in entityTypes"
        :key="i"
        :index="i"
        :entity-type="entityType"
        :entity="entities[i]"
        :details="details(i)"
      />
    </div>
    <div v-else class="sidebar-list-item no-content" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EntityDetails from './EntityDetails.vue';
import entityDetails from '../../utility/entity-details.js';


export default {
  name: 'EntitiesList',
  components: {
    EntityDetails,
  },
  computed: {
    ...mapGetters(['entities']),
    entityTypes() {
      return this.entities
        .map((e) => {
          // Handle case where Rollup has mangled constructor name
          // https://github.com/rollup/rollup/issues/1914
          const name = e.constructor.name.split('$')[0];

          return {
            Multiline: 'Polycurve',
            Polygon: 'Polyface',
          }[name] || name;
        });
    },
  },
  methods: {
    details(index) {
      const entity = this.entities[index];
      const type = this.entityTypes[index];
      return entityDetails[type](entity);
    },
  },
};
</script>
