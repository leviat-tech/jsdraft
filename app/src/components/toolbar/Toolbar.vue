<template>
  <div class="toolbar">
    <warning-modal
      v-if="creatingNewFile"
      :text="null"
      cancel="Cancel"
      proceed="Create New File"
      @cancel="creatingNewFile = false"
      @proceed="newFile"
    >
      Are you sure you want to create a new file? Any unsaved changes will be lost.
    </warning-modal>
    <div class="tools">
      <tool-group>
        <tool
          tool-id="select"
          name="Select"
          icon="pointer-outline"
          :selected="currentTool"
          @click="chooseTool('select')"
        />

        <tool
          tool-id="pan"
          name="Pan"
          icon="hand"
          :selected="currentTool"
          @click="chooseTool('pan')"
        />

        <tool
          tool-id="fit"
          name="Fit View"
          icon="expand"
          @click="fitToExtents"
        />
      </tool-group>

      <!-- point -->

      <!-- segment -->

      <!-- arc -->

      <!-- polyline -->


      <!-- fillet -->

      <!-- split -->

      <!-- trim -->

      <!-- extend -->

      <!-- offset -->

      <tool-group>
        <tool
          tool-id="new"
          name="New File"
          icon="file"
          @click="askToCreateNewFile"
        />

        <tool
          tool-id="open"
          name="Open"
          icon="folder-open"
          @click="openFolder"
        />

        <tool
          tool-id="save"
          name="Download"
          icon="save"
          @click="save"
        />

        <tool
          tool-id="export"
          name="Export"
          icon="file-export"
          @click="exportFile"
        />

        <tool
          tool-id="reload"
          name="Reload"
          icon="redo"
          @click="reload"
        />
      </tool-group>

      <tool-group>
        <toggle
          v-model="showHidden"
          name="Show hidden elements"
        >
          <template #on>
            <eye-icon class="lg" />
          </template>
          <template #off>
            <eye-slash-icon class="lg" />
          </template>
        </toggle>
      </tool-group>
    </div>
    <d-button
      v-if="!showCodePanel"
      name="Code"
      class="code-button"
      @click="openCodePanel"
    >
      <code-icon class="lg" />
    </d-button>
    <input
      v-if="!electron"
      id="fileReader"
      type="file"
      webkitdirectory
      mozdirectory
      style="display:none;"
      accept=".draft"
      @change="loadFile"
    >
  </div>
</template>

<script>
import Mousetrap from 'mousetrap';
import { mapState, mapMutations, mapActions } from 'vuex';
import isEqual from 'lodash/isEqual';
import ToolGroup from './ToolGroup.vue';
import Tool from './Tool.vue';
import Toggle from './Toggle.vue';
import WarningModal from '../WarningModal.vue';
import DButton from '../DButton.vue';
import loadFileInBrowser from '../../utility/load-file-in-browser.js';
import CodeIcon from '../../assets/icons/code.svg';
import EyeIcon from '../../assets/icons/eye.svg';
import EyeSlashIcon from '../../assets/icons/eye-slash.svg';
import { js, json } from '../../utility/default-blank-sketches.js';


export default {
  name: 'Toolbar',
  components: {
    ToolGroup,
    Tool,
    Toggle,
    DButton,
    CodeIcon,
    EyeIcon,
    EyeSlashIcon,
    WarningModal,
  },
  data() {
    return {
      creatingNewFile: false,
    };
  },
  computed: {
    ...mapState(['currentTool', 'showCodePanel', 'filename', 'path', 'files', 'electron']),
    filesHaveChanged() {
      return !isEqual(this.files, {
        'index.json': json(),
        'main.js': js('main'),
      });
    },
    showHidden: {
      get() {
        return this.$store.state.showHidden;
      },
      set(value) {
        this.$store.commit('setShowHidden', value);
      },
    },
  },
  mounted() {
    Mousetrap.bind('mod+s', () => {
      this.save();
      return false;
    });
    Mousetrap.bind('mod+o', () => {
      this.openFolder();
      return false;
    });
  },
  methods: {
    ...mapMutations(['setCurrentTool', 'setShowCodePanel', 'reset']),
    ...mapActions(['save', 'importFile', 'updateXrefs']),
    chooseTool(id) {
      this.setCurrentTool(id);
    },
    fitToExtents() {},
    openFolder() {
      if (!this.electron) {
        const fileReader = document.getElementById('fileReader');
        fileReader.click();
      } else {
        this.loadFile();
      }
    },
    askToCreateNewFile() {
      if (this.filesHaveChanged) {
        this.creatingNewFile = true;
      } else {
        this.reset({
          files: {
            'index.json': json(),
            'main.js': js('main'),
          },
          currentFile: 'main.js',
        });
      }
    },
    newFile() {
      this.creatingNewFile = false;
      this.reset({
        files: {
          'index.json': json(),
          'main.js': js('main'),
        },
        currentFile: 'main.js',
      });
    },
    async loadFile(e) {
      const loaded = await (this.electron
        ? window.electron.openFile()
        : loadFileInBrowser(e));

      this.importFile(loaded);
    },
    exportFile() {

    },
    reload() {
      if (!this.path) {
        this.openFolder();
      } else {
        this.updateXrefs();
      }
    },
    openCodePanel() {
      this.setShowCodePanel(true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

.toolbar {
  display: flex;
}

.toolbar > * + * {
  margin-right: .25rem;
}

.tools {
  padding: .25rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  min-height: 3rem;
  justify-content: flex-start;
}

.tools * {
  box-sizing: border-box;
}

.tools > * + * {
  margin-left: .25rem;
  margin-right: .25rem;
  padding-left: .25rem;
  border-left: $border-sm solid $color-gray-04;
}

</style>
