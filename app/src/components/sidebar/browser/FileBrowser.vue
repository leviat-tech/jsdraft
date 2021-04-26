<template>
  <div class="file-browser">
    <file-header />
    <file-tab v-for="file in files" :key="file" :file="file" />
    <div v-if="files.length === 0" class="empty">
      Click the plus to add a new feature.
    </div>
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
  .file-browser {
    .empty {
      font-size: .8rem;
      text-align: center;
      padding: 1rem 0rem;
      color: $color-gray-08
    }
  }
</style>
