<template>
  <modal v-show="showing" class="create-modal" :header="false" @close="close">
    <div class="instructions">Enter path for new file.</div>
    <file-input ref="input" v-model="file" @submit="create" @keydown.enter="create" />
    <div class="error">{{ error }}</div>
  </modal>
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import get from 'lodash/get';
import Modal from '../../Modal.vue';
import FileInput from './FileInput.vue';
import { yaml, js, json } from '../../../utility/default-blank-sketches.js';
import parseFilename from '../../../utility/parse-filename.js';


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
  computed: {
    ...(mapState(['currentFile', 'files'])),
    ...(mapGetters(['currentFolder'])),
    path() {
      return this.currentFolder ? this.currentFolder.concat(`/${this.file}`) : this.file;
    },
    alreadyExists() {
      const p = this.path.split('/');
      const c = get(this.files, p);
      return c !== undefined;
    },
  },
  methods: {
    default() {
      let i = 0;
      let name = 'untitled.js';
      let path = this.currentFolder.split('/').concat(name);
      while (get(this.$store.state.files, path)) {
        i += 1;
        name = `untitled${i}.js`;
        path = this.currentFolder.split('/').concat(name);
      }
      return name;
    },
    open() {
      this.file = this.default();
      this.showing = true;
      this.$nextTick(() => {
        this.$refs.input.focus({ select: true });
      });
    },
    close() {
      this.showing = false;
      this.file = this.default();
      this.error = '';
    },
    create() {
      if (!this.file.endsWith('.js') && !this.file.endsWith('.yaml') && this.path !== 'index.json') {
        this.error = 'The file path must end with .js or .yaml';
      } else if (this.alreadyExists) {
        this.error = 'A file with this name already exists';
      } else {
        const file = parseFilename(this.file);
        if (this.path === 'index.json') {
          this.$store.commit('updateFile', { path: 'index.json', code: json() });
        } else if (this.file.endsWith('.yaml')) {
          this.$store.commit('updateFile', { path: this.path, code: yaml(file.name) });
        } else {
          this.$store.commit('updateFile', { path: this.path, code: js(file.name) });
        }
        this.$store.commit('setCurrentFile', this.path);
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
