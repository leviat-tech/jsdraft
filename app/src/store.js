import { Draft, parse } from '@crhio/jsdraft';
import set from 'lodash/set';
import get from 'lodash/get';
import unset from 'lodash/unset';
import cloneDeep from 'lodash/cloneDeep';
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
  for (let i = 0; i < arr.length; i += 1) {
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
    xrefs: {}, // In-memory contents of x-ref'ed draft files
    electron,
    currentPoint: { x: 0, y: 0 },
    gridStepSize: 10,
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
    setXrefs(state, value) {
      state.xrefs = value;
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
    setGridStepSize(state, value) {
      state.gridStepSize = value;
    },
  },

  actions: {
    watchPath({ state, commit }) {
      window.electron.watchDirectory(state.path, commit);
    },

    async getDiskState({ state, commit }) {
      const { _xrefs, ...files } = await window.electron.getFile(state.path);

      const newFilePaths = diffFiles(files, state.files);

      newFilePaths.forEach((path) => {
        commit('updateFile', { path: path.join('/'), code: get(files, path) });
      });

      commit('setDiskFiles', files);
    },

    async importFile({ dispatch, commit }, { files, filename, path }) {
      commit('reset');

      const { _xrefs, ...draftFiles } = files;

      dispatch('loadFiles', draftFiles);
      commit('setFilename', filename);
      if (_xrefs) commit('setXrefs', _xrefs);

      if (electron) {
        commit('setDiskFiles', cloneDeep(files));
        commit('setPath', path);
        dispatch('watchPath');
      }

      dispatch('zoomToExtents');
    },

    async updateXrefs({ state, commit }) {
      const { _xrefs } = await window.electron.getFile(state.path);
      if (_xrefs) commit('setXrefs', _xrefs);
    },

    loadFiles({ commit }, files) {
      commit('setFiles', files);

      // Choose the first as the new active file
      const first = traverseFiles(
        files,
        (file) => ['js', 'yaml'].includes(file[0].split('.').pop()),
      );
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

    zoomToExtents({ state, getters, commit }) {
      const extents = getters.extents;
      if (!extents) return;

      const size = {
        width: extents.xmax - extents.xmin,
        height: extents.ymax - extents.ymin,
      };

      const contentAspectRatio = size.width / size.height;
      const viewAspectRatio = state.viewBox.width / state.viewBox.height;

      const zoomScale = contentAspectRatio > viewAspectRatio
        ? state.viewBox.width / size.width
        : state.viewBox.height / size.height;

      const center = {
        x: (extents.xmin + (extents.xmax - extents.xmin) / 2) * zoomScale,
        y: -(extents.ymin + (extents.ymax - extents.ymin) / 2) * zoomScale,
      };

      const viewBox = {
        minX: center.x - state.viewBox.width / 2,
        minY: center.y - state.viewBox.height / 2,
        width: state.viewBox.width,
        height: state.viewBox.height,
      };

      commit('setViewBox', viewBox);
      commit('setZoomScale', zoomScale);
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
      try {
        return Draft.load({ ...state.files, _xrefs: state.xrefs });
      } catch {
        return null;
      }
    },
    sketch(state, getters) {
      try {
        return getters.draft.render(getters.currentFeatureName, state.overrides, 'sketch');
      } catch {
        return null;
      }
    },
    extents(state, getters) {
      if (!getters.sketch) return null;
      return getters.sketch.extents;
    },
    entities(state, getters) {
      try {
        let hidden = [];
        if (state.showHidden) {
          hidden = getters.sketch.hidden.entities.map((e) => {
            e.hidden = true;
            return e;
          });
        }
        return hidden.concat(getters.sketch.entities);
      } catch {
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
      } catch {
        // console.debug(e);
        return '';
      }
    },
    errors(state, getters) {
      const errors = {};
      if (!getters.draft) return errors;
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
