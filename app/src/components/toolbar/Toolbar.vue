<template>
  <div class="toolbar">
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
          tool-id="open"
          name="Open"
          icon="folder-open"
          @click="openFolder"
        />

        <!-- new file -->

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
      </tool-group>
    </div>
    <d-button
      v-if="!showCodePanel && filesExist"
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
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import isElectron from 'is-electron';
import ToolGroup from './ToolGroup.vue';
import Tool from './Tool.vue';
import DButton from '../DButton.vue';
import loadFileInBrowser from '../../utility/load-file-in-browser.js';
import saveFileInBrowser from '../../utility/save-file-in-browser.js';
import CodeIcon from '../../assets/icons/code.svg';


const electron = isElectron();

export default {
  name: 'Toolbar',
  components: {
    ToolGroup,
    Tool,
    DButton,
    CodeIcon,
  },
  data() {
    return {
      electron,
    };
  },
  computed: {
    ...mapState(['currentTool', 'showCodePanel', 'filename', 'path']),
    ...mapGetters(['draft']),
    filesExist() {
      return Object.keys(this.draft.files).length > 0;
    },
  },
  methods: {
    ...mapMutations(['setCurrentTool', 'setShowCodePanel', 'setFilename', 'setPath']),
    ...mapActions(['loadFiles']),
    chooseTool(id) {
      this.setCurrentTool(id);
    },
    fitToExtents() {

    },
    openFolder() {
      if (!electron) {
        const fileReader = document.getElementById('fileReader');
        fileReader.click();
      } else {
        this.loadFile();
      }
    },
    async loadFile(e) {
      let files;
      let path;
      let filename = 'Draft';

      if (!electron) {
        files = await loadFileInBrowser(e);
        this.loadFiles(files);
      } else {
        const loaded = await window.electron.openFile();
        path = loaded.path;
        filename = loaded.filename;
      }

      this.setFilename(filename);
      this.setPath(path);
      this.fitToExtents();
    },
    save() {
      const files = Object.entries(this.draft.files)
        .map(([name, file]) => ({
          name,
          extension: file.extension,
          contents: file.contents,
        }));

      if (!electron) {
        saveFileInBrowser(this.filename, this.draft);
      } else if (this.path) {
        window.electron.saveFile(this.path, files);
      } else {
        const path = window.electron.saveAs(this.filename, files);
        this.setPath(path);
      }
    },
    exportFile() {

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
