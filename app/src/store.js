import { Draft, parse } from '@crhio/jsdraft';
import set from 'lodash/set';
import get from 'lodash/get';
import unset from 'lodash/unset';
import { createStore } from 'vuex';
import isElectron from 'is-electron';
import VuexPersistence from 'vuex-persist';
import parseFilename from './utility/parse-filename.js';
import saveFileInBrowser from './utility/save-file-in-browser.js';


const persistence = new VuexPersistence({
  storage: window.localStorage,
});

const electron = isElectron();

function traverseFiles(files, condition, path = '') {
  const arr = Object.entries(files);
  for (let i = 0; i < arr.length - 1; i += 1) {
    const file = arr[i];

    if (typeof file[1] === 'object') {
      const result = traverseFiles(file[1], condition, file[0]);
      if (result) return result;
    } else if (condition(file)) {
      return {
        path: path ? `${path}/${file[0]}` : file[0],
        contents: file[1],
      };
    }
  }

  return null;
}

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
    setFiles(state, value) {
      state.files = value;
    },
    setCurrentPoint(state, value) {
      state.currentPoint = value;
    },
    updateFile(state, { path, code }) {
      if (!path) {
        console.warn(`Warning! Tried to write an undefined file to draft: ${path}!`);
        return;
      }

      // Can't use string notation for set/get because of file extensions
      const p = path.split('/');
      set(state.files, p, code);
    },
    removeFile(state, path) {
      // Check whether currently selected file is being removed
      if (state.currentFile
        && path === state.currentFile) {
        state.currentFile = null;
        state.showCodePanel = false;
      }

      const p = path.split('/');
      unset(state.files, p);
    },
    renameFile(state, { path: oldPath, newPath }) {
      const p = oldPath.split('/');
      const q = newPath.split('/');
      const contents = get(state.files, p);

      set(state.files, q, contents);
      if (oldPath === state.currentFile) {
        state.currentFile = newPath;
      }

      unset(state.files, p);
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
      commit('setFiles', files);

      // Choose the first as the new active file
      const first = traverseFiles(files, (file) => ['js', 'yaml'].includes(file[0].split('.').pop()));
      if (first) commit('setCurrentFile', first.path);
    },

    save({ state, commit }) {
      if (!electron) {
        saveFileInBrowser(state.filename, state.files);
      } else if (state.path) {
        window.electron.saveFile(state.path, JSON.parse(JSON.stringify(state.files)));
      } else {
        const path = window.electron.saveAs(state.filename, JSON.parse(JSON.stringify(state.files)));
        commit('setPath', path);
      }
    },
  },

  getters: {
    currentFileName(state) {
      if (!state.currentFile) return null;
      return state.currentFile.split('/').pop();
    },
    currentFeatureName(state, getters) {
      if (!getters.currentFileName) return null;
      const file = parseFilename(getters.currentFileName);
      if (file) return file.name;
      return null;
    },
    draft(state) {
      return Draft.load(state.files);
    },
    entities(state, getters) {
      try {
        return getters.draft.render(
          getters.currentFeatureName,
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
          getters.currentFeatureName,
          state.overrides,
          'svg',
          { viewport: null },
        );
      } catch (e) {
        // console.debug(e);
        return '';
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
