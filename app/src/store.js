import { createStore } from 'vuex';
import parseFilename from './utility/parse-filename.js';
import { Draft, parse } from '../../dist/draft.js';


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
      overrides: [],
      hovered: {},
      selected: {},
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
    removeFile(state, filename) {
      const { name } = parseFilename(filename);
      const filenames = Object.keys(state.files);
      if (name === state.currentFile && filenames.length > 1) {
        const newCurrent = filenames.find((f) => f !== filename);
        const { name: newName } = parseFilename(newCurrent);
        state.currentFile = newName;
      } else if (name === state.currentFile) {
        state.currentFile = null;
      }
      delete state.files[filename];
    },
    renameFile(state, { name: oldFileName, newName: newFileName }) {
      const { name } = parseFilename(oldFileName);
      const { name: newName } = parseFilename(newFileName);
      state.files[newFileName] = state.files[oldFileName];
      if (name === state.currentFile) state.currentFile = newName;
      delete state.files[oldFileName];
    },
    setOverrides(state, overrides) {
      state.overrides = overrides;
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
          draft.add_file(name, 'sketch', extension, contents);
        });

      return draft;
    },
    entities(state, getters) {
      try {
        return getters.draft.render(
          state.currentFile,
          state.overrides,
          'entities',
        );
      } catch (e) {
        return [];
      }
    },
    svg(state, getters) {
      if (!state.currentFile) return [];
      try {
        return getters.draft.render(
          state.currentFile,
          state.overrides,
          'svg',
          { viewport: null },
        );
      } catch (e) {
        // console.debug(e);
        return [];
      }
    },
    errors(state, getters) {
      const errors = {};
      Object.keys(getters.draft.files).forEach((name) => {
        const sketch = getters.draft.files[name];
        try {
          parse(sketch.extension, sketch.contents, name);
          getters.draft.render(
            state.currentFile,
            state.overrides,
            'svg',
            { viewport: null },
          );
        } catch (error) {
          errors[name] = error;
        }
      });
      return errors;
    },
  },
});
