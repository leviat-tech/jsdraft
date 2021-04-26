<template>
  <div>
    <context-menu ref="menu" :items="['Open', 'Rename', 'Delete']" @select="select" />
    <rename-modal ref="rename" :initial="file" />
    <delete-modal ref="delete" :file="file" />
  </div>
</template>


<script>
import ContextMenu from '../../ui/ContextMenu.vue';
import RenameModal from './RenameModal.vue';
import DeleteModal from './DeleteModal.vue';


export default {
  name: 'FileContextMenu',
  components: {
    ContextMenu,
    RenameModal,
    DeleteModal,
  },
  props: {
    file: { type: Object, required: true },
  },
  methods: {
    open(event) {
      this.$refs.menu.open(event);
    },
    select(item) {
      if (item === 'Open') {
        this.$store.commit('setCurrentFile', this.file.path);
      } else if (item === 'Rename') {
        this.$refs.rename.open();
      } else if (item === 'Delete') {
        this.$refs.delete.open();
      }
    },
  },
};
</script>
