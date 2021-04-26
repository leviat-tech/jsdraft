<template>
  <div class="file-tab">
    <div
      class="tab"
      :class="[active ? 'active': '', indent]"
      @dblclick.native="open"
      @click="select('Open')"
      @mouseup.right="$refs.menu.open($event)"
      @contextmenu.prevent
    >
      {{ file.name }}{{ file.type === 'folder' ? '/' : '' }}
    </div>
    <div
      v-if="file.type === 'folder'"
      class="folder"
    >
      <file-tab
        v-for="child in file.contents"
        :key="child.name"
        :file="child"
        :depth="depth + 1"
      />
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
  props: {
    file: { type: Object, required: true },
    depth: { type: Number, default: 0 },
  },
  computed: {
    active() {
      return this.file.path === this.$store.state.currentFile;
    },
    indent() {
      return this.depth
        ? `indent-${this.depth}`
        : '';
    },
  },
  methods: {
    select() {
      this.$store.commit('setCurrentFile', this.file.path);
    },
    open() {
      this.$store.commit('setCurrentFile', this.file.path);
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

      &.indent-1 {
        padding-left: 2rem;
      }

      &.indent-2 {
        padding-left: 3rem;
      }

      &.indent-3 {
        padding-left: 4rem;
      }
    }
  }
</style>
