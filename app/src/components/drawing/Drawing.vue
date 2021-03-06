<template>
  <g v-html="svg" />
</template>

<script>
import { mapGetters } from 'vuex';


export default {
  name: 'Drawing',
  computed: {
    ...mapGetters(['svg']),
  },
};
</script>
