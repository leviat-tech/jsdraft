<template>
  <div class="sidebar">
    <div class="header">
      Draft
    </div>
    <div class="panels" />

    <file-browser />
  </div>
</template>

<script>
import FileBrowser from './FileBrowser.vue';


export default {
  name: 'Sidebar',
  components: {
    FileBrowser,
  },
  data() {
    return {
      showParamForm: false,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

button {
  background-color: #ddd;
  border: 0;
  border-radius: $radius;
}

.header {
  font-size: $text-base;
  width: 100%;
  background-color: $color-gray-01;
  border-bottom: $border-sm solid $color-gray-03;
  line-height: 3rem;
  min-height: 3rem;
  padding-left: .25rem;
  padding-right: .25rem;
  text-align: center;
  font-weight: bold;
}

.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: $border-sm solid $color-gray-03;
}

.draft-editor {
  border-left: $border-sm solid $color-gray-03;
}

.panels {
  overflow: hidden;
}

</style>
