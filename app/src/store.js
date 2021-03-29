import { createStore } from 'vuex';
import { Draft } from '../../dist/draft.js';
import parseFilename from './utility/parse-filename.js';


export default createStore({
  state() {
    return {
      zoomScale: 1,
      currentTool: 'select',
      showCodePanel: false,
      viewBox: { minX: -100, minY: -100, width: 200, height: 200 },
      currentFile: null,
      filename: 'Draft',
      path: undefined,
      files: {},
      errors: {},
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
    setCurrentFile(state, value) {
      state.currentFile = value;
    },
    setFilename(state, value) {
      state.filename = value;
    },
    setPath(state, value) {
      state.path = value;
    },
    removeAllFiles(state) {
      state.files = {};
    },
    updateFile(state, { name, code }) {
      state.files[name] = code;
    },
    removeFile(state, name) {
      delete state.files[name];
    },
    renameFile(state, { name: oldFileName, newName: newFileName }) {
      const { name } = parseFilename(oldFileName);
      const { name: newName } = parseFilename(newFileName);
      state.files[newFileName] = state.files[oldFileName];
      if (name === state.currentFile) state.currentFile = newName;
      delete state.files[oldFileName];
    },
  },

  actions: {
    loadFiles({ commit }, files) {
      commit('removeAllFiles');

      // Sort files alphabetically
      files.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });

      // Add files to list of files
      files.forEach((file) => {
        commit('updateFile', {
          name: `${file.name}.sketch.${file.extension}`,
          code: file.contents,
        });
      });

      // Choose the first as the new active file
      if (files.length > 0) {
        commit('setCurrentFile', files[0].name);
      }
    },
  },

  getters: {
    draft(state) {
      const draft = new Draft();
      Object.entries(state.files)
        .forEach(([filename, contents]) => {
          const { name, extension } = parseFilename(filename);
          draft.add_file(name, extension, contents);
        });

      return draft;
    },
    svg(state, getters) {
      if (!state.currentFile) return [];
      try {
        return getters.draft.render(
          state.currentFile,
          [],
          'svg',
          { viewport: null },
        );
      } catch (e) {
        console.debug(e);
        return [];
      }
    },
  },
});
