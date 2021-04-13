import { createStore } from 'vuex';
import isElectron from 'is-electron';
import VuexPersistence from 'vuex-persist';
import parseFilename from './utility/parse-filename.js';
import { Draft, parse } from '../../dist/draft.js';
import saveFileInBrowser from './utility/save-file-in-browser.js';


const persistence = new VuexPersistence({
  storage: window.localStorage,
});

const electron = isElectron();

function reset() {
  return {
    zoomScale: 1,
    currentTool: 'select',
    showCodePanel: false,
    viewBox: { minX: -100, minY: -100, width: 200, height: 200 },
    currentFile: null,
    filename: 'Draft',
    path: undefined,
    overrides: [],
    hovered: null,
    selected: {},
    files: {},
    electron,
  };
}

export default createStore({
  state: reset,
  plugins: [persistence.plugin],
  mutations: {
    reset(state) {
      const fresh = reset();
      Object.keys(fresh).forEach((key) => {
        state[key] = fresh[key];
      });
    },
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
      const filenames = Object.keys(state.files);
      if (filename === state.currentFile && filenames.length > 1) {
        const newCurrent = filenames.find((f) => f !== filename);
        state.currentFile = newCurrent;
      } else if (filename === state.currentFile) {
        state.currentFile = null;
        state.showCodePanel = false;
      }
      delete state.files[filename];
    },
    renameFile(state, { name: oldFileName, newName: newFileName }) {
      state.files[newFileName] = state.files[oldFileName];
      if (oldFileName === state.currentFile) state.currentFile = newFileName;
      delete state.files[oldFileName];
    },
    setOverrides(state, overrides) {
      state.overrides = overrides;
    },
    setHovered(state, value) {
      state.hovered = value;
    },
    setSelected(state, value) {
      state.selected = value;
    },
  },

  actions: {
    watchPath({ state, commit }, ignoreInitial) {
      if (electron) {
        window.electron.watchDirectory(state.path, commit, ignoreInitial);
      }
    },
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
        commit('setCurrentFile', files[0].filename);
      }
    },

    save({ state, getters, commit }) {
      const files = Object.entries(getters.draft.files)
        .map(([name, file]) => ({
          name,
          extension: file.extension,
          contents: file.contents,
        }));

      if (!electron) {
        saveFileInBrowser(state.filename, getters.draft);
      } else if (state.path) {
        window.electron.saveFile(state.path, files);
      } else {
        const path = window.electron.saveAs(state.filename, files);
        commit('setPath', path);
      }
    },
  },

  getters: {
    currentFileName(state) {
      if (!state.currentFile) return null;
      const { name } = parseFilename(state.currentFile);
      return name;
    },
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
          getters.currentFileName,
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
          getters.currentFileName,
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
            name,
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
