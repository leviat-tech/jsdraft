import { createStore } from 'vuex';
import { Draft } from '../../dist/draft.js';


export default createStore({
  state() {
    return {
      zoomScale: 1,
      currentTool: 'select',
      showCodePanel: false,
      viewBox: { minX: -100, minY: -100, width: 200, height: 200 },
      draft: new Draft(),
      currentSketch: null,
    };
  },

  mutations: {
    setZoomScale(state, value) {
      state.zoomScale = value;
    },
    setCurrentTool(state, value) {
      state.currentTool = value;
    },
    setShowCodePanel(state, value) {
      state.showCodePanel = value;
    },
    setViewBox(state, value) {
      state.viewBox = value;
    },
    setCurrentSketch(state, value) {
      state.currentSketch = value;
    },
    updateSketch(state, { name, language, code }) {
      state.draft.add_sketch(name, language, code);
    },
    renameSketch(state, { name, newName }) {
      state.draft.rename_sketch(name, newName);
    },
  },

  getters: {
    entities(state) {
      if (!state.currentSketch) return [];
      try {
        return state.draft.render(
          state.currentSketch,
          { format: 'svg-entities' },
          [],
        );
      } catch (e) {
        // console.log(e);
        return [];
      }
    },
  },
});
