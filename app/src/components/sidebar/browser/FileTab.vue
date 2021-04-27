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
      <dot-icon
        v-if="fileIsChanged"
        class="sm dot-icon"
      />
      <span>{{ file.name }}{{ file.type === 'folder' ? '/' : '' }}</span>
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
import { mapState } from 'vuex';
import get from 'lodash/get';
import FileContextMenu from './FileContextMenu.vue';
import DotIcon from '../../../assets/icons/dot.svg';


export default {
  name: 'FileTab',
  components: {
    FileContextMenu,
    DotIcon,
  },
  props: {
    file: { type: Object, required: true },
    depth: { type: Number, default: 0 },
  },
  computed: {
    ...(mapState(['disk', 'electron', 'path'])),
    active() {
      return this.file.path === this.$store.state.currentFile;
    },
    indent() {
      return this.depth
        ? `indent-${this.depth}`
        : '';
    },
    fileIsChanged() {
      if (!this.electron || !this.path || !(this.file.type === 'file')) return false;
      const p = this.file.path.split('/');
      return this.file.contents !== get(this.disk, p);
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
      // font-family: $font-monospace;
      font-size: .85rem;
      cursor: pointer;
      color: $color-gray-10;
      position: relative;

      .dot-icon {
        position: absolute;
        margin-left: -0.75rem;
        margin-top: 0.0625rem;
      }

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
