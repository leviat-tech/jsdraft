<template>
  <div class="viewport">
    <div class="current-point">
      x: <span class="coordinate">{{ pointDisplay.x }}</span>
      y: <span class="coordinate">{{ pointDisplay.y }}</span>
    </div>
    <svg
      ref="svg"
      class="drawing"
      :viewBox="vbString"
      @mousewheel="handleZoom"
      @wheel="handleZoom"
      @pointerdown="handleMousedown"
      @pointermove="handleMousemove"
      @pointerup="handleMouseup"
    >
      <g
        ref="contents"
        class="drawing-contents"
        :transform="`translate(${dragOffset.x} ${dragOffset.y})
                     scale(${zoomScale} -${zoomScale})`"
      >
        <grid :view-box="viewBox" />
        <drawing />
      </g>
    </svg>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import Mousetrap from 'mousetrap';
import { mapState, mapMutations } from 'vuex';
import Grid from './Drawing/Grid.vue';
import Drawing from './Drawing/Drawing.vue';


function domToSVGCoords(el, pt) {
  const { x, y } = pt.matrixTransform(el.getScreenCTM().inverse());
  return { x, y };
}


export default {
  name: 'Viewport',
  components: {
    Grid,
    Drawing,
  },


  data() {
    return {
      selection: null,
      hoverPt: null,
      svgP: { x: 0, y: 0 },
      dwgP: { x: 0, y: 0 },
      dragFrom: null,
      constrained: false,
      dragOffset: { x: 0, y: 0 },
      isPanning: false,
      tempTool: null,
    };
  },


  computed: {
    ...mapState(['zoomScale', 'currentTool', 'viewBox']),
    vbString() {
      const { minX, minY, width, height } = this.viewBox;
      return `${minX} ${minY} ${width} ${height}`;
    },
    pointDisplay() {
      return {
        x: Math.round(this.dwgP.x),
        y: Math.round(this.dwgP.y),
      };
    },
  },


  mounted() {
    this.$nextTick(() => {
      // Disable right-click context menu
      this.$refs.svg.addEventListener('contextmenu', (e) => e.preventDefault());
      this.hoverPt = this.$refs.svg.createSVGPoint();

      document.addEventListener('pointerleave', this.documentMouseleave);

      // Add event handlers for constraining vertical/horizontal
      Mousetrap.bind('shift', () => { this.constrained = true; }, 'keypress');
      Mousetrap.bind('shift', () => { this.constrained = false; }, 'keyup');
    });
  },


  unmounted() {
    document.removeEventListener('pointerleave', this.documentMouseleave);
  },


  methods: {
    ...mapMutations(['setZoomScale', 'setCurrentTool', 'setViewBox']),

    isEmpty,

    setMousePt(e) {
      this.hoverPt.x = e.clientX;
      this.hoverPt.y = e.clientY;
      this.svgP = domToSVGCoords(this.$refs.svg, this.hoverPt);
      this.dwgP = domToSVGCoords(this.$refs.contents, this.hoverPt);
    },

    handleMousedown(e) {
      this.setMousePt(e);
      this.$refs.svg.setPointerCapture(e.pointerId);
      if (this.currentTool === 'draw' && e.which === 1) {
        this.drawPt();
      }

      if (e.which === 3 || this.currentTool === 'pan') {
        this.panstart();
      }
    },

    handleMousemove(e) {
      this.setMousePt(e);
      if (this.currentTool === 'draw') {
        this.currentSegment = {
          pt0: this.draft.lastPt() || { x: 0, y: 0 },
          pt1: { x: Math.round(this.dwgP.x), y: Math.round(this.dwgP.y) },
        };
      }

      if (this.isPanning) {
        this.pan();
      }
    },

    handleMouseup(e) {
      this.setMousePt(e);
      this.$refs.svg.releasePointerCapture(e.pointerId);
      if (this.isPanning) {
        this.panend();
      }
    },
    documentMouseleave() {
      if (this.isPanning) this.panend();
    },

    panstart() {
      this.isPanning = true;
      this.tempTool = this.currentTool;
      this.setCurrentTool('pan');
      const { x, y } = this.svgP;
      this.dragFrom = { x, y };
    },

    pan() {
      const { x, y } = this.svgP;
      this.dragOffset = {
        x: x - this.dragFrom.x,
        y: y - this.dragFrom.y,
      };
    },

    panend() {
      const { x, y } = this.svgP;
      this.dragOffset = {
        x: x - this.dragFrom.x,
        y: y - this.dragFrom.y,
      };

      this.viewBox.minX -= this.dragOffset.x;
      this.viewBox.minY -= this.dragOffset.y;
      this.dragOffset = { x: 0, y: 0 };
      this.isPanning = false;
      this.setCurrentTool(this.tempTool);
    },

    handleZoom(e) {
      const viewOffset = {
        x: (this.viewBox.minX) / this.zoomScale,
        y: -(this.viewBox.minY) / this.zoomScale,
      };

      const mouseOffset = {
        x: this.dwgP.x - viewOffset.x,
        y: this.dwgP.y - viewOffset.y,
      };

      const zoomScale = e.deltaY > 0
        ? this.zoomScale * 1.1
        : this.zoomScale * (1 / 1.1);

      const newMouseOffset = {
        x: mouseOffset.x / (zoomScale / this.zoomScale),
        y: mouseOffset.y / (zoomScale / this.zoomScale),
      };

      const newViewOffset = {
        x: this.dwgP.x - newMouseOffset.x,
        y: this.dwgP.y - newMouseOffset.y,
      };

      const viewBox = {
        minX: newViewOffset.x * zoomScale,
        minY: -newViewOffset.y * zoomScale,
        width: this.viewBox.width,
        height: this.viewBox.height,
      };

      this.setZoomScale(zoomScale);
      this.setViewBox(viewBox);
    },
  },
};
</script>

<style lang="scss">
@import '../assets/styles/variables.scss';

.viewport {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.drawing {
  width: 100%;
  height: 100%;
  display: flex;
}

.drawing > g text {
  text-anchor: middle;
}

.path-point {
  fill: $color-black;

  &:hover {
    fill: $color-blue;
  }
}

.current-point {
  position: absolute;
  bottom: 0.25rem;
  right: 0;
  padding: 0.5rem;
  user-select: none;
}

.current-line {
  vector-effect: non-scaling-stroke;
  stroke-width: 1.5px;
  stroke: #000;
}

.coordinate {
  display: inline-block;
  width: 2rem;
}

.view-switcher {
  position: absolute;
  bottom: 0;
  left: 0;
}

</style>