<template>
  <div class="files">
    <warning-modal
      v-if="showDeleteModal"
      :title="`Warning: Delete ${fileToDelete}`"
      :text="deleteModalText"
      cancel="Cancel"
      proceed="Delete"
      @cancel="showDeleteModal = false"
      @proceed="deleteFile(fileToDelete)"
    />
    <div class="files-header">
      <h2>Files</h2>
      <d-button
        name="New File"
        size="sm"
        icon="plus"
        @click="beginAddingFile"
      />
    </div>
    <div
      v-for="file in files"
      :key="file[0]"
      class="sketch"
      :class="{ active: currentFile === file[0] }"
      @click="setCurrentFile(file[0])"
    >
      <div class="sketch-details">
        <div
          v-if="fileToRename === file[0]"
        >
          <input
            ref="renamed_file_input"
            v-model="newFileName"
            class="file-browser-input"
            type="text"
            @keydown.enter="renameFile"
            @blur="renameFile"
            @keydown.esc="stopRenamingFile"
          >
        </div>
        <div
          v-else
          class="filename"
          @click="beginRenamingFile(file[0])"
        >
          {{ file[0] }}
        </div>
        <div class="filetype">{{ file[1].filetype }}</div>
      </div>
      <d-button
        name="Delete File"
        size="xs"
        class="trash-button"
        @click.stop="askToDeleteFile(file[0])"
      >
        <trash-icon class="svg-inline sm" />
      </d-button>
    </div>
    <div
      v-if="isAddingFile"
      class="sketch"
    >
      <div class="sketch-details">
        <div class="filename">
          <input
            ref="new_file_input"
            v-model="newFileName"
            class="file-browser-input"
            type="text"
            @keydown.enter="newFile"
            @blur="newFile"
            @keydown.esc="stopAddingFile"
          >
        </div>
        <div class="filetype">yaml</div>
      </div>
      <d-button
        name="Delete File"
        size="xs"
        class="trash-button"
        @click.stop="stopAddingFile"
      >
        <trash-icon class="svg-inline sm" />
      </d-button>
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue';
import { mapState, mapMutations } from 'vuex';
import WarningModal from '../WarningModal.vue';
import DButton from '../DButton.vue';
import TrashIcon from '../../assets/icons/trash.svg';
import incrementName from '../../utility/increment-name.js';
import { yaml } from '../../utility/default-blank-sketches.js';


export default {
  name: 'FileBrowser',
  components: {
    WarningModal,
    DButton,
    TrashIcon,
  },
  data() {
    return {
      showDeleteModal: false,
      fileToDelete: null,
      isAddingFile: false,
      fileToRename: null,
      newFileName: null,
    };
  },
  computed: {
    ...mapState(['draft', 'currentFile']),

    // File list in alphabetical order
    files() {
      return Object.entries(this.draft.files)
        .sort((a, b) => {
          if (a[0] < b[0]) return -1;
          if (a[0] > b[0]) return 1;
          return 0;
        });
    },

    existingFilenames() {
      return Object.keys(this.draft.files);
    },

    deleteModalText() {
      return `Are you sure you want to delete the sketch "${this.fileToDelete}"?`;
    },
  },
  mounted() {
    // create a new untitled sketch in a blank draft file
    if (this.files.length === 0) {
      this.updateFile({
        name: 'untitled',
        language: 'yaml',
        code: yaml(),
      });
      this.setCurrentFile('untitled');
    }
  },
  methods: {
    ...mapMutations(['setCurrentFile', 'updateFile', 'removeFile', 'renameFile']),
    async beginAddingFile() {
      this.newFileName = incrementName('untitled', this.existingFilenames);
      this.isAddingFile = true;
      await nextTick();
      this.$refs.new_file_input.focus();
      this.$refs.new_file_input.select();
    },
    async beginRenamingFile(name) {
      if (name !== this.currentFile) return;
      this.newFileName = name;
      this.fileToRename = name;
      await nextTick();
      this.$refs.renamed_file_input.focus();
      this.$refs.renamed_file_input.select();
    },
    stopAddingFile() {
      this.newFileName = null;
      this.isAddingFile = false;
    },
    stopRenamingFile() {
      this.newFileName = null;
      this.fileToRename = null;
    },
    newFile() {
      if (!this.newFileName || this.existingFilenames.includes(this.newFileName)) return;
      this.updateFile({
        name: this.newFileName,
        language: 'yaml',
        code: yaml(),
      });
      this.setCurrentFile(this.newFileName);
      this.stopAddingFile();
    },
    renameFile() {
      if (this.newFileName === this.fileToRename) {
        this.stopRenamingFile();
        return;
      }
      if (!this.newFileName || this.existingFilenames.includes(this.newFileName)) return;
      this.renameFile({ name: this.fileToRename, newName: this.newFileName });
      this.stopRenamingFile();
    },
    askToDeleteFile(name) {
      this.fileToDelete = name;
      this.showDeleteModal = true;
    },
    deleteFile(name) {
      this.removeFile(name);
      this.showDeleteModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

.files {
  border-top: $border-sm solid $color-gray-03;
  margin-bottom: 0.5rem;
  padding-top: 1rem;

  .sketch {
    padding: 0.25rem 0.25rem 0.25rem 1rem;
    font-size: $text-sm;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .sketch-details {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;

      .filetype {
        color: $color-gray-06;
      }
    }

    .trash-button {
      flex: none;
      visibility: hidden;
    }

    &:hover {
      background-color: $color-gray-03;

      .trash-button {
        visibility: visible;
      }
    }

    &.active, &.active:hover {
      color: $color-white;
      background-color: $color-blue-highlight;

      .sketch-details {
        .filetype {
          color: $color-white;
        }
      }
    }
  }
}

.modal-text {
  margin-bottom: 1rem;
}

.modal-buttons {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

.cancel-button {
  margin-right: 0.5rem;
}

.files-header {
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  justify-content: space-between;

  .button {
    margin-top: -0.25rem;
  }
}

.file-browser-input {
  border: none;
  outline: none;
  background: transparent;
  display: inline;
  font-family: inherit;
  font-size: inherit;
  padding: none;
  width: auto;
}
</style>
