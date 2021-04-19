import { Draft, parse } from '@crhio/jsdraft';
import { createStore } from 'vuex';
import isElectron from 'is-electron';
import VuexPersistence from 'vuex-persist';
import parseFilename from './utility/parse-filename.js';
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
    features: {
      sketch: {},
    },
    electron,
    currentPoint: { x: 0, y: 0 },
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
      state.features = {
        sketch: {},
      };
    },
    setCurrentPoint(state, value) {
      state.currentPoint = value;
    },
    updateFile(state, { name, type, code }) {
      if (!name) {
        console.warn('Warning! Tried to write an undefined fill to draft: ${name}!');
        return;
      }
      state.features[type][name] = code;
    },
    removeFile(state, { name, type }) {
      const filenames = Object.keys(state.features[type]);

      // Check whether currently selected file is being removed
      if (state.currentFile
        && name === state.currentFile.filename
        && type === state.currentFile.type
        && filenames.length > 1) {
        const newCurrent = filenames.find((f) => f !== name);
        state.currentFile = { filename: newCurrent, type };

      // Check whether we are removing the last file
      } else if (state.currentFile
        && name === state.currentFile.filename
        && type === state.currentFile.type) {
        state.currentFile = null;
        state.showCodePanel = false;
      }

      delete state.features[type][name];
    },
    renameFile(state, { name: oldFileName, newName: newFileName, type }) {
      state.features[type][newFileName] = state.features[type][oldFileName];
      if (oldFileName === state.currentFile.filename
        && type === state.currentFile.type) {
        state.currentFile = { filename: newFileName, type };
      }

      delete state.features[type][oldFileName];
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
      files.sketch.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });

      // Add files to list of files
      files.sketch.forEach((file) => {
        commit('updateFile', {
          name: `${file.name}.${file.extension}`,
          type: 'sketch',
          code: file.contents,
        });
      });

      // Choose the first as the new active file
      if (files.sketch.length > 0) {
        commit('setCurrentFile', { filename: files.sketch[0].filename, type: 'sketch' });
      }
    },

    save({ state, getters, commit }) {
      console.log('hello', state.filename, 'path', state.path);
      if (!electron) {
        saveFileInBrowser(state.filename, getters.draft);
      } else if (state.path) {
        window.electron.saveFile(state.path, getters.draft);
      } else {
        const path = window.electron.saveAs(state.filename, getters.draft);
        commit('setPath', path);
      }
    },
  },

  getters: {
    currentFileName(state) {
      if (!state.currentFile || !state.currentFile.filename) return null;
      const { name } = parseFilename(state.currentFile.filename);
      return name;
    },
    draft(state) {
      const draft = new Draft();
      Object.entries(state.features.sketch)
        .forEach(([filename, contents]) => {
          const parsed = parseFilename(filename);
          if (parsed) {
            const { name, extension } = parsed;
            draft.add_feature(name, extension, contents);
          } else {
            console.warn(`Warning: failed to parse file name ${filename}`);
          }
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
      Object.keys(getters.draft.features.sketch).forEach((name) => {
        const sketch = getters.draft.features.sketch[name];
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
