import { createStore } from 'vuex';
import { Draft } from '../../dist/draft.js';


export default createStore({
  state() {
    return {
      zoomScale: 1,
      currentTool: 'select',
      showCodePanel: false,
      viewBox: { minX: -100, minY: -100, width: 200, height: 200 },
      currentSketch: null,
      filename: 'Draft',
      path: undefined,
      draft: new Draft(),
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
    setFilename(state, value) {
      state.filename = value;
    },
    setPath(state, value) {
      state.path = value;
    },
    newDraft(state) {
      state.draft = new Draft();
    },
    updateSketch(state, { name, language, code }) {
      state.draft.add_sketch(name, language, code);
    },
    removeSketch(state, name) {
      state.draft.remove_sketch(name);
    },
    renameSketch(state, { name, newName }) {
      state.draft.rename_sketch(name, newName);
    },
  },

  actions: {
    loadFiles({ commit }, files) {
      // Make a new blank draft
      commit('newDraft');

      // Sort files alphabetically
      files.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });

      // Add files to draft
      files.forEach((file) => {
        commit('updateSketch', {
          name: file.name,
          language: file.extension,
          code: file.contents,
        });
      });

      // Choose the first as the new active sketch
      if (files.length > 0) {
        commit('setCurrentSketch', files[0].name);
      }
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
