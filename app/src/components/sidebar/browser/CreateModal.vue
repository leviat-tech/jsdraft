<template>
  <modal v-show="showing" class="create-modal" :header="false" @close="close">
    <div class="instructions">Enter path for new file.</div>
    <file-input ref="input" v-model="file" @submit="create" @keydown.enter="create" />
    <div class="error">{{ error }}</div>
  </modal>
</template>


<script>
import { mapState } from 'vuex';
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
      file: this.default(),
      error: '',
    };
  },
  computed: {
    ...(mapState(['currentFile'])),
    folder() {
      if (!this.currentFile) return '';

      // A file is selected
      if (this.currentFile.match(/.+\.(yaml|js|json)$/)) {
        return this.currentFile.split('/').slice(0, -1).join('/');
      }

      // A folder is selected
      return this.currentFile;
    },
    path() {
      return this.folder ? this.folder.concat(`/${this.file}`) : this.file;
    },
    alreadyExists() {
      const files = this.$store.state.files;
      const p = this.path.split('/');
      const c = get(files, p);
      return c !== undefined;
    },
  },
  methods: {
    default() {
      let i = 0;
      let name = 'example.js';
      while (this.$store.state.files[name]) {
        i += 1;
        name = `example${i}.js`;
      }
      return name;
    },
    open() {
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
