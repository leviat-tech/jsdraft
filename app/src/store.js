import { createStore } from 'vuex';
import upperFirst from 'lodash/upperFirst';
import { Draft, entity_type } from '../../dist/draft.js';


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
      hovered: {},
      selected: {},
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
    setHovered(state, value) {
      state.hovered = value;
    },
    hoverEntity(state, value) {
      state.hovered[value] = true;
    },
    unhoverEntity(state, value) {
      delete state.hovered[value];
    },
    setSelected(state, value) {
      state.selected = value;
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
    sketch(state) {
      try {
        const func = state.draft.sketches[state.currentSketch].func;
        return func(state.draft.sketch, []);
      } catch (e) {
        return null;
      }
    },
    svg(state) {
      if (!state.currentSketch) return [];
      try {
        return state.draft.render(
          state.currentSketch,
          [],
          'svg',
          { viewport: null },
        );
      } catch (e) {
        return null;
      }
    },
    entities(state, getters) {
      if (!getters.sketch) return [];

      return Array.from(getters.sketch.entities())
        .map((entity) => ({
          type: upperFirst(entity_type(entity)),
          entity,
        }));
    },
  },
});
