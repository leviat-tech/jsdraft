<template>
  <modal v-show="showing" class="create-modal" :header="false" @close="close">
    <div class="instructions">Enter path for new file.</div>
    <file-input ref="input" v-model="file" @submit="create" @keydown.enter="create" />
    <div class="error">{{ error }}</div>
  </modal>
</template>


<script>
import Modal from '../../Modal.vue';
import FileInput from './FileInput.vue';
import { yaml, js } from '../../../utility/default-blank-sketches.js';


export default {
  name: 'CreateModal',
  components: {
    Modal,
    FileInput,
  },
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
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    close() {
      this.showing = false;
      this.file = '';
      this.error = '';
    },
    create() {
      if (!this.file.endsWith('.sketch.js') && !this.file.endsWith('.sketch.yaml')) {
        this.error = 'The file path must end with .sketch.js or .sketch.yaml';
      } else if (this.$store.state.files[this.file] !== undefined) {
        this.error = 'A file with this name already exists';
      } else {
        if (this.file.endsWith('.sketch.yaml')) {
          this.$store.commit('updateFile', { name: this.file, code: yaml() });
        } else {
          this.$store.commit('updateFile', { name: this.file, code: js() });
        }
        this.$store.commit('setCurrentFile', this.file);
        this.close();
      }
    },
  },
};
</script>


<style lang="scss" scoped>
  @import '../../../assets/styles/variables.scss';

  .create-modal {
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
