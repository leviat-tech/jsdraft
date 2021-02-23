import { createStore } from 'vuex';
import { draft } from '../../dist/draft.js';


console.log('sketch', draft.sketch);



export const store = createStore({
  state() {
    return {
      zoomScale: 1,
      currentTool: 'select',
      showCodePanel: false,
      code: '',
      viewBox: { minX: -100, minY: -100, width: 200, height: 200 },
    }
  },

  mutations: {
    setZoomScale(state, value) {
      state.zoomScale = value;
    },
    setCurrentTool(state, value) {
      state.currentTool = value;
    },
    setViewBox(state, value) {
      state.viewBox = value;
    },
    setShowCodePanel(state, value) {
      state.showCodePanel = value;
    },
    setCode(state, value) {
      state.code = value;
    },
  },

  getters: {
    renderedSvg(s) {

    },
  },
})