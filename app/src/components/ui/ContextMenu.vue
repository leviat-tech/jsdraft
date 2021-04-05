<template>
  <click-off ref="menu" class="context-menu" :style="{top: `${y}px`, left: `${x}px`, visible}">
    <div class="menu" @contextmenu.prevent>
      <div v-for="item in items" :key="item" class="item" @click.prevent.stop="select(item)">
        {{ item }}
      </div>
    </div>
  </click-off>
</template>


<script>
import ClickOff from './ClickOff.vue';


export default {
  name: 'FileBrowser',
  components: {
    ClickOff,
  },
  props: {
    items: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      x: 0,
      y: 0,
      visible: true,
    };
  },
  methods: {
    open(event) {
      const x = event.clientX;
      const y = event.clientY;
      this.x = x;
      this.y = y;

      // render to dom but keep it invisible for one tick to compute size
      this.visible = false;
      this.$refs.menu.open();

      // comput size and reposition if we are on the edge of the screen
      this.$nextTick(() => {
        const rect = this.$refs.menu.$el.getBoundingClientRect();
        this.x = Math.min(this.x, window.innerWidth - rect.width);
        this.y = Math.min(this.y, window.innerHeight - rect.height);
        this.visible = true;
      });
    },
    close() {
      this.$refs.menu.close();
    },
    select(item) {
      this.$emit('select', item);
      this.close();
    },
  },
};
</script>


<style lang="scss" scoped>
  @import '../../assets/styles/variables.scss';

  .context-menu {
    z-index: 999999999;
    position: fixed;
    color: $color-gray-10;
    border: 1px solid $color-gray-04;
    background: $color-gray-02;

    cursor: pointer;
    font-family: $font-monospace;
    font-size: .75rem;

    .item {
      padding: .3rem 1rem;
      &:hover {
        background-color: $color-gray-04;
        // color: $color-white;
        // background-color: $color-blue-highlight;
      }
    }
  }
</style>
