<template>
  <div class="sidebar">
    <div class="header">
      {{ filename }}
    </div>
    <div class="panels">
      <parameters />
    </div>
    <file-browser />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import FileBrowser from './FileBrowser.vue';
import Parameters from './Parameters.vue';


export default {
  name: 'Sidebar',
  components: {
    FileBrowser,
    Parameters,
  },
  data() {
    return {
      showParamForm: false,
    };
  },
  computed: {
    ...mapState(['filename']),
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
  overflow-y: auto;
  flex: 1 1 0%;
}

</style>
