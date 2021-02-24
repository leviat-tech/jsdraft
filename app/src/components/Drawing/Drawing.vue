<template>
  <g v-html="allEntities" />
</template>

<script>
import { mapGetters } from 'vuex';


export default {
  name: 'Drawing',
  computed: {
    ...mapGetters(['entities']),
    allEntities() {
      return this.entities.reduce((a, e) => a.concat(e), '');
    },
  },
};
</script>
