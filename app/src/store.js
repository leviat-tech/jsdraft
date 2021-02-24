import { createStore } from 'vuex';
import { Sketch, svg_entities } from '../../dist/draft.js';


export default createStore({
  state() {
    return {
      zoomScale: 1,
      currentTool: 'select',
      showCodePanel: false,
      code: '',
      language: 'js',
      viewBox: { minX: -100, minY: -100, width: 200, height: 200 },
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
    setCode(state, value) {
      state.code = value;
    },
    setLanguage(state, value) {
      state.language = value;
    },
    setViewBox(state, value) {
      state.viewBox = value;
    },
  },

  getters: {
    codeFunction(s) {
      return new Function('sketch', s.code); // eslint-disable-line
    },
    entities(s, g) {
      const sketch = new Sketch();
      try {
        const result = g.codeFunction && g.codeFunction(sketch);
        const entities = svg_entities(result);
        return entities;
      } catch (err) {
        return [];
      }
    },
  },
});
