<template>
  <div class="file-tab">
    <div class="tab" :class="{active}" @click="menu('Open')" @mouseup.right="open" @contextmenu.prevent>
      {{ file }}
    </div>
    <context-menu ref="menu" :items="['Open', 'Rename', 'Delete']" @select="menu" />
    <rename-modal ref="rename" :initial="file" />
    <delete-modal ref="delete" :file="file" />
  </div>
</template>

<script>
import ContextMenu from '../../ui/ContextMenu.vue';
import RenameModal from './RenameModal.vue';
import DeleteModal from './DeleteModal.vue';


export default {
  name: 'FileTab',
  components: {
    ContextMenu,
    RenameModal,
    DeleteModal,
  },
  props: ['file'],
  computed: {
    active() {
      return this.file === this.$store.state.currentFile;
    },
  },
  methods: {
    open(event) {
      this.$refs.menu.open(event);
    },
    menu(item) {
      if (item === 'Open') {
        this.$store.commit('setCurrentFile', this.file);
      } else if (item === 'Rename') {
        this.$refs.rename.open();
      } else if (item === 'Delete') {
        this.$refs.delete.open();
      }
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
