<template>
  <div class="viewport">
    <svg
      ref="svg"
      class="drawing"
      :viewBox="vbString"
      @mousewheel="handleZoom"
      @wheel="handleZoom"
      @pointerdown="handleMousedown"
      @pointermove="handleMousemove"
      @pointerup="handleMouseup"
      @click="deselectEntities"
    >
      <defs>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line style="stroke:red;stroke-width:.3" x1="3" y1="0" x2="3" y2="6" />
          <line style="stroke:red;stroke-width:.3" x1="0" y1="3" x2="6" y2="3" />
        </pattern>
      </defs>
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
    <editable-dimension />
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import Mousetrap from 'mousetrap';
import { mapState, mapMutations } from 'vuex';
import { nextTick } from 'vue';
import Grid from './drawing/Grid.vue';
import Drawing from './drawing/Drawing.vue';
import EditableDimension from './inputs/EditableDimension.vue';


function domToSVGCoords(el, pt) {
  const { x, y } = pt.matrixTransform(el.getScreenCTM().inverse());
  return { x, y };
}


export default {
  name: 'Viewport',
  components: {
    Grid,
    Drawing,
    EditableDimension,
  },


  data() {
    return {
      selection: null,
      hoverPt: null,
      svgP: { x: 0, y: 0 },
      dragFrom: null,
      constrained: false,
      dragOffset: { x: 0, y: 0 },
      isPanning: false,
      tempTool: null,
    };
  },


  computed: {
    ...mapState(['zoomScale', 'currentTool', 'viewBox', 'currentPoint']),
    vbString() {
      const { minX, minY, width, height } = this.viewBox;
      return `${minX} ${minY} ${width} ${height}`;
    },
  },


  async mounted() {
    await nextTick();

    // Disable right-click context menu
    this.$refs.svg.addEventListener('contextmenu', (e) => e.preventDefault());
    this.hoverPt = this.$refs.svg.createSVGPoint();

    document.addEventListener('pointerleave', this.documentMouseleave);

    // Add event handlers for constraining vertical/horizontal
    Mousetrap.bind('shift', () => { this.constrained = true; }, 'keypress');
    Mousetrap.bind('shift', () => { this.constrained = false; }, 'keyup');
  },


  unmounted() {
    document.removeEventListener('pointerleave', this.documentMouseleave);
  },


  methods: {
    ...mapMutations(['setZoomScale', 'setCurrentTool', 'setViewBox', 'setSelected', 'setCurrentPoint']),

    isEmpty,

    setMousePt(e) {
      this.hoverPt.x = e.clientX;
      this.hoverPt.y = e.clientY;
      this.svgP = domToSVGCoords(this.$refs.svg, this.hoverPt);
      this.setCurrentPoint(domToSVGCoords(this.$refs.contents, this.hoverPt));
    },

    handleMousedown(e) {
      this.setMousePt(e);
      (e.target || this.$refs.svg).setPointerCapture(e.pointerId);
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
          pt1: { x: Math.round(this.currentPoint.x), y: Math.round(this.currentPoint.y) },
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
        x: this.currentPoint.x - viewOffset.x,
        y: this.currentPoint.y - viewOffset.y,
      };

      const zoomScale = e.deltaY > 0
        ? this.zoomScale * 1.1
        : this.zoomScale * (1 / 1.1);

      const newMouseOffset = {
        x: mouseOffset.x / (zoomScale / this.zoomScale),
        y: mouseOffset.y / (zoomScale / this.zoomScale),
      };

      const newViewOffset = {
        x: this.currentPoint.x - newMouseOffset.x,
        y: this.currentPoint.y - newMouseOffset.y,
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

    deselectEntities() {
      this.setSelected({});
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

.path-point {
  fill: $color-black;

  &:hover {
    fill: $color-blue;
  }
}

.current-line {
  vector-effect: non-scaling-stroke;
  stroke-width: 1.5px;
  stroke: #000;
}

.view-switcher {
  position: absolute;
  bottom: 0;
  left: 0;
}

</style>
