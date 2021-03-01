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
      v-if="!showCodePanel && sketchesExist"
      name="Code"
      icon="code"
      @click="openCodePanel"
    />
    <input
      v-if="!isElectron()"
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
import { mapState, mapMutations, mapActions } from 'vuex';
import isElectron from 'is-electron';
import ToolGroup from './ToolGroup.vue';
import Tool from './Tool.vue';
import DButton from '../DButton.vue';
import loadFileInBrowser from '../../utility/load-file-in-browser.js';


export default {
  name: 'Toolbar',
  components: {
    ToolGroup,
    Tool,
    DButton,
  },
  computed: {
    ...mapState(['currentTool', 'showCodePanel', 'draft']),
    sketchesExist() {
      return Object.keys(this.draft.sketches).length > 0;
    },
  },
  methods: {
    ...mapMutations(['setCurrentTool', 'setShowCodePanel']),
    ...mapActions(['loadFiles']),
    isElectron,
    chooseTool(id) {
      this.setCurrentTool(id);
    },
    fitToExtents() {

    },
    openFolder() {
      const fileReader = document.getElementById('fileReader');
      fileReader.click();
    },
    async loadFile(e) {
      let files;
      if (!isElectron()) {
        files = await loadFileInBrowser(e);
      }

      this.loadFiles(files);
      // this.zoomToFit();
    },
    save() {

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
