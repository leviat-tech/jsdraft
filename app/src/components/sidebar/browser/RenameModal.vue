<template>
  <modal v-show="showing" class="rename-modal" :header="false" @close="close">
    <div class="instructions">Enter the new path for file.</div>
    <file-input ref="input" v-model="file" @submit="rename" @keydown.enter="rename" />
    <div class="error">{{ error }}</div>
  </modal>
</template>


<script>
import Modal from '../../Modal.vue';
import FileInput from './FileInput.vue';


export default {
  name: 'RenameModal',
  components: {
    Modal,
    FileInput,
  },
  props: ['initial'],
  data() {
    return {
      showing: false,
      file: '',
      error: '',
    };
  },
  methods: {
    open() {
      this.showing = true;
      this.file = this.initial;
      this.$nextTick(() => {
        this.$refs.input.focus({ select: true });
      });
    },
    close() {
      this.showing = false;
      this.file = '';
      this.error = '';
    },
    rename() {
      if (!this.file.endsWith('.js') && !this.file.endsWith('.yaml')) {
        this.error = 'The file path must end with .js or .yaml';
      } else if (this.initial === this.file) {
        this.close();
      } else if (this.$store.state.features.sketch[this.file] !== undefined) {
        this.error = 'A file with this name already exists';
      } else {
        this.$store.commit('renameFile', { name: this.initial, newName: this.file, type: 'sketch' });
        this.close();
      }
    },
  },
};
</script>


<style lang="scss" scoped>
  @import '../../../assets/styles/variables.scss';

  .rename-modal {
    .instructions {
      color: $color-gray-09;
      font-size: .9rem;
    }
    .error {
      padding-top: .5rem;
      font-size: .8rem;
      color: $color-red;
    }
  }
</style>
