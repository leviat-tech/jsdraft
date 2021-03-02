<template>
  <div class="files">
    <warning-modal
      v-if="showDeleteModal"
      :title="`Warning: Delete ${sketchToDelete}`"
      :text="deleteModalText"
      cancel="Cancel"
      proceed="Delete"
      @cancel="showDeleteModal = false"
      @proceed="deleteSketch(sketchToDelete)"
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
      v-for="sketch in sketches"
      :key="sketch[0]"
      class="sketch"
      :class="{ active: currentSketch === sketch[0] }"
      @click="setCurrentSketch(sketch[0])"
    >
      <div class="sketch-details">
        <div
          v-if="fileToRename === sketch[0]"
        >
          <input
            ref="renamed_file_input"
            v-model="newSketchName"
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
          @click="beginRenamingFile(sketch[0])"
        >
          {{ sketch[0] }}
        </div>
        <div class="filetype">{{ sketch[1].filetype }}</div>
      </div>
      <d-button
        name="Delete File"
        size="xs"
        class="trash-button"
        @click.stop="askToDeleteSketch(sketch[0])"
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
            v-model="newSketchName"
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
      sketchToDelete: null,
      isAddingFile: false,
      fileToRename: null,
      newSketchName: null,
    };
  },
  computed: {
    ...mapState(['draft', 'currentSketch']),

    // Sketch list in alphabetical order
    sketches() {
      return Object.entries(this.draft.sketches)
        .sort((a, b) => {
          if (a[0] < b[0]) return -1;
          if (a[0] > b[0]) return 1;
          return 0;
        });
    },

    existingFilenames() {
      return Object.keys(this.draft.sketches);
    },

    deleteModalText() {
      return `Are you sure you want to delete the sketch "${this.sketchToDelete}"?`;
    },
  },
  mounted() {
    // create a new untitled sketch in a blank draft file
    if (this.sketches.length === 0) {
      this.updateSketch({
        name: 'untitled',
        language: 'yaml',
        code: yaml(),
      });
      this.setCurrentSketch('untitled');
    }
  },
  methods: {
    ...mapMutations(['setCurrentSketch', 'updateSketch', 'removeSketch', 'renameSketch']),
    async beginAddingFile() {
      this.newSketchName = incrementName('untitled', this.existingFilenames);
      this.isAddingFile = true;
      await nextTick();
      this.$refs.new_file_input.focus();
      this.$refs.new_file_input.select();
    },
    async beginRenamingFile(name) {
      if (name !== this.currentSketch) return;
      this.newSketchName = name;
      this.fileToRename = name;
      await nextTick();
      this.$refs.renamed_file_input.focus();
      this.$refs.renamed_file_input.select();
    },
    stopAddingFile() {
      this.newSketchName = null;
      this.isAddingFile = false;
    },
    stopRenamingFile() {
      this.newSketchName = null;
      this.fileToRename = null;
    },
    newFile() {
      if (!this.newSketchName || this.existingFilenames.includes(this.newSketchName)) return;
      this.updateSketch({
        name: this.newSketchName,
        language: 'yaml',
        code: yaml(),
      });
      this.setCurrentSketch(this.newSketchName);
      this.stopAddingFile();
    },
    renameFile() {
      if (this.newSketchName === this.fileToRename) {
        this.stopRenamingFile();
        return;
      }
      if (!this.newSketchName || this.existingFilenames.includes(this.newSketchName)) return;
      this.renameSketch({ name: this.fileToRename, newName: this.newSketchName });
      this.stopRenamingFile();
    },
    askToDeleteSketch(name) {
      this.sketchToDelete = name;
      this.showDeleteModal = true;
    },
    deleteSketch(name) {
      this.removeSketch(name);
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
