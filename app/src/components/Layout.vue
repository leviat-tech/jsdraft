<template>
  <div class="layout">
    <div class="drawing-container">
      <div class="toolbar-container">
        <toolbar />
      </div>

      <div class="viewport-container">
        <viewport />
      </div>
    </div>
    <code-panel
      v-if="showCodePanel"
      class="code-panel"
    />
    <sidebar class="sidebar" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Sidebar from './sidebar/Sidebar.vue';
import CodePanel from './CodePanel.vue';
import Toolbar from './toolbar/Toolbar.vue';
import Viewport from './Viewport.vue';


export default {
  name: 'Layout',
  components: {
    Sidebar,
    CodePanel,
    Toolbar,
    Viewport,
  },
  data() {
    return {
      showExportModal: false,
      showDraftEditor: false,
    };
  },
  computed: {
    ...mapState(['showCodePanel']),
  },
};
</script>

<style lang="scss">
@import '../assets/styles/variables.scss';

.viewport-container {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.viewport-switcher {
  position: absolute;
  top: 0;
  left: 0;
}

.layout {
  height: 100%;
  width: 100%;
  display: flex;
}

.p {
  margin-bottom: 1rem;
}

.p-label {
  color: #999;
}

.drawing-container {
  display: flex;
  flex-direction: column;
}

.toolbar-container {
  border-bottom: $border-sm solid $color-gray-03;
  position: relative;
}

.toolbar {
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar {
  width: 16rem;
  flex: none;
}

.drawing-container {
  flex: 1 1 0%;
  min-width: 0;
}

.svg-button {
  margin-right: 1rem;
}

.toolbar-button {
  cursor: pointer;
  margin-right: 1rem;
}

.code-panel {
  width: 40rem;
  flex: none;
}

</style>
