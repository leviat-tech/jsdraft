<template>
  <div class="file-browser">
    <file-header />
    <file-tab v-for="file in files" :key="file" :file="file" />
  </div>
</template>


<script>
import FileHeader from './FileHeader.vue';
import FileTab from './FileTab.vue';


export default {
  name: 'FileBrowser',
  components: {
    FileHeader,
    FileTab,
  },
  computed: {
    files() { return Object.keys(this.$store.state.files).sort(); },
  },
};
</script>


<style lang="scss" scoped>
  @import '../../../assets/styles/variables.scss';
  .file-browser {}
</style>
