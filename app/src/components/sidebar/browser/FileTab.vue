<template>
  <div class="file-tab">
    <div class="tab" :class="{active}"
         @dblclick.native="open"
         @click="select('Open')"
         @mouseup.right="$refs.menu.open($event)"
         @contextmenu.prevent
    >
      {{ file }}
    </div>
    <file-context-menu ref="menu" :file="file" />
  </div>
</template>

<script>

import FileContextMenu from './FileContextMenu.vue';


export default {
  name: 'FileTab',
  components: {
    FileContextMenu,
  },
  props: ['file'],
  computed: {
    active() {
      return this.file === this.$store.state.currentFile;
    },
  },
  methods: {
    select() {
      this.$store.commit('setCurrentFile', this.file);
    },
    open() {
      this.$store.commit('setCurrentFile', this.file);
      this.$store.commit('setShowCodePanel', true);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '../../../assets/styles/variables.scss';

  .file-tab {
    .tab {
      padding: .5rem 1rem;
      display: flex;
      justify-content: space-between;
      font-family: $font-monospace;
      font-size: .85rem;
      cursor: pointer;
      color: $color-gray-10;
      &:hover {
        background-color: $color-gray-03;
      }
      &.active, &.active:hover {
        color: $color-white;
        background-color: $color-blue-highlight;
      }
    }
  }
</style>
