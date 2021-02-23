<template>
  <div class="toolbar">
    <div class="tools">
      <tool-group>
        <tool
          name="Select"
          id="select"
          icon="pointer-outline"
          :selected="currentTool"
          @click="chooseTool('select')"
        />

        <tool
          name="Pan"
          id="pan"
          icon="hand"
          :selected="currentTool"
          @click="chooseTool('pan')"
        />

        <tool
          name="Fit View"
          id="fit"
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
          name="Open"
          id="open"
          icon="folder-open"
          @click="openFolder"
        />

        <tool
          name="Download"
          id="save"
          icon="save"
          @click="save"
        />

        <tool
          name="Export"
          id="export"
          icon="file-export"
          @click="export"
        />

      </tool-group>
    </div>
    <tool
      v-if="!showCodePanel"
      name="Code"
      id="code"
      icon="code"
      @click="openCodePanel"
    />
  </div>
</template>

<script>
import ToolGroup from './ToolGroup.vue';
import Tool from './Tool.vue';
import { mapState, mapMutations } from 'vuex';


export default {
  name: 'Toolbar',
  components: {
    ToolGroup,
    Tool,
  },
  computed: {
    ...mapState(['currentTool', 'showCodePanel']),
  },
  methods: {
    ...mapMutations(['setCurrentTool', 'setShowCodePanel']),
    chooseTool(id) {
      this.setCurrentTool(id);
    },
    fitToExtents() {

    },
    openFolder() {

    },
    save() {

    },
    export() {

    },
    openCodePanel() {
      this.setShowCodePanel(true);
    },
  },
}
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
