<template>
  <div class="file-header">
    <h2>Files</h2>
    <d-button name="New File" size="sm" icon="plus" @click="create" />
    <create-modal ref="modal" />
  </div>
</template>


<script>
import DButton from '../../DButton.vue';
import CreateModal from './CreateModal.vue';


export default {
  name: 'FileHeader',
  components: {
    DButton,
    CreateModal,
  },
  methods: {
    create() { this.$refs.modal.open(); },
  },
};
</script>


<style lang="scss" scoped>
  @import '../../../assets/styles/variables.scss';

  .file-header {
    flex: none;
    padding: .5rem 1rem;
    border-top: $border-sm solid $color-gray-03;
    border-bottom: $border-sm solid $color-gray-03;
    display: flex;
    justify-content: space-between;
    h2 { margin: 0rem; }
  }
</style>
