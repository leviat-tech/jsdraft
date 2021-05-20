import { Draft, parse } from '@crhio/jsdraft';
import set from 'lodash/set';
import get from 'lodash/get';
import unset from 'lodash/unset';
import { createStore } from 'vuex';
import { toRaw } from 'vue';
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

function diffFiles(test, files, path = []) {
  return Object.entries(test).reduce((diff, [name, contents]) => {
    if (typeof contents === 'object') {
      const paths = diffFiles(contents, files[name] || {}, [...path, name]);
      diff.push(...paths);
    } else if (!files[name]) {
      diff.push([...path, name]);
    }

    return diff;
  }, []);
}

function reset() {
  return {
    zoomScale: 1,
    currentTool: 'select',
    showCodePanel: false,
    showHidden: false,
    viewBox: { minX: -100, minY: -100, width: 200, height: 200 },
    currentFile: null,
    filename: 'untitled.draft',
    path: undefined,
    overrides: [],
    hovered: null,
    selected: {},
    files: {}, // In-memory state of files
    disk: {}, // State of files on disk (only relevant for electron)
    electron,
    currentPoint: { x: 0, y: 0 },
  };
}

export default createStore({
  state: reset,
  plugins: [persistence.plugin],
  mutations: {
    reset(state, { files = {}, currentFile = null } = {}) {
      const fresh = reset();
      Object.keys(fresh).forEach((key) => {
        state[key] = fresh[key];
      });

      Object.entries(files).forEach(([path, contents]) => {
        const p = path.split('/');
        set(state.files, p, contents);
      });

      if (currentFile) {
        state.currentFile = currentFile;
      }
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
    setShowHidden(state, value) {
      state.showHidden = value;
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
    setDiskFiles(state, value) {
      state.disk = value;
    },
    updateDiskFile(state, { path, code }) {
      const p = path.split('/');
      set(state.disk, p, code);
    },
    removeDiskFile(state, path) {
      const p = path.split('/');
      unset(state.disk, p);
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
    watchPath({ state, commit }) {
      window.electron.watchDirectory(state.path, commit);
    },

    async getDiskState({ state, commit }) {
      const files = await window.electron.getFile(state.path);

      const newFilePaths = diffFiles(files, state.files);

      newFilePaths.forEach((path) => {
        commit('updateFile', { path: path.join('/'), code: get(files, path) });
      });

      commit('setDiskFiles', files);
    },

    loadFiles({ commit }, files) {
      commit('setFiles', files);

      // Choose the first as the new active file
      const first = traverseFiles(files, (file) => ['js', 'yaml'].includes(file[0].split('.').pop()));
      if (first) commit('setCurrentFile', first.path);
    },

    async save({ state, commit, dispatch }) {
      if (!electron) {
        saveFileInBrowser(state.filename, state.files);
      } else if (state.path) {
        window.electron.saveFile(state.path, toRaw(state.files));
      } else {
        const { path, filename, canceled } = await window.electron.saveAs(state.filename, toRaw(state.files));
        if (canceled) return;
        commit('setFilename', filename);
        commit('setPath', path);
        dispatch('watchPath');
      }
    },

    async removeFile({ state, commit }, path) {
      if (electron && state.path) {
        await window.electron.removeFile(`${state.path}/${path}`);
      }

      commit('removeFile', path);
    },

    async renameFile({ state, commit }, { path, newPath }) {
      if (electron && state.path) {
        await window.electron.renameFile(`${state.path}/${path}`, `${state.path}/${newPath}`);
      }

      commit('renameFile', { path, newPath });
    },
  },

  getters: {
    currentFileName(state) {
      if (!state.currentFile) return null;
      return state.currentFile.split('/').pop();
    },
    currentFolder(state) {
      if (!state.currentFile) return '';

      // A file is selected
      if (state.currentFile.match(/.+\.(yaml|js|json)$/)) {
        return state.currentFile.split('/').slice(0, -1).join('/');
      }

      // A folder is selected
      return state.currentFile;
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
        let hidden = [];
        if (state.showHidden) {
          hidden = getters.draft.render(
            getters.currentFeatureName,
            state.overrides,
            'entities',
            { show: 'hidden' },
          ).map((e) => {
            e.hidden = true;
            return e;
          });
        }
        return hidden.concat(getters.draft.render(
          getters.currentFeatureName,
          state.overrides,
          'entities',
        ));
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
          { viewport: null, show: state.showHidden ? 'all' : 'visible' },
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
