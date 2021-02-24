<template>
  <g>
    <g
      v-for="(entity, index) in entities"
      :key="index"
      v-html="entity"
    />
  </g>
</template>

<script>
import { mapGetters } from 'vuex';


export default {
  name: 'Drawing',
  computed: {
    ...mapGetters(['entities']),
  },
};
</script>
