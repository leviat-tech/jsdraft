<template>
  <context-menu ref="menu" :items="['Open', 'Rename', 'Delete']" @select="select" />
</template>


<script>
import ContextMenu from '../../ui/ContextMenu.vue';


export default {
  name: 'FileContextMenu',
  components: {
    ContextMenu,
  },
  methods: {
    open(event) {
      console.log('open');
      this.$refs.menu.open(event);
    },
    select(item) {
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

  .file-context-menu {
  }
</style>
