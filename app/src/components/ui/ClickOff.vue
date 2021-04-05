<!-- This component is a div that can be shown or hidden and will hide itself when clicked off -->

<template>
  <div v-show="showing" ref="root" class="click-off">
    <slot />
  </div>
</template>


<script>
export default {
  name: 'ClickOff',
  data() {
    return {
      showing: false,
      listener: null,
    };
  },
  methods: {
    open() {
      this.showing = true;
      this.listen();
      this.$emit('opened');
    },
    close() {
      this.showing = false;
      this.unlisten();
      this.$emit('closed');
    },
    toggle() {
      if (this.showing) {
        this.close();
      } else {
        this.open();
      }
    },
    listen() {
      this.listener = (event) => {
        if (this.$refs.root && !this.$refs.root.contains(event.target)) {
          this.close();
        }
      };
      document.addEventListener('mousedown', this.listener);
    },
    unlisten() {
      document.removeEventListener('mousedown', this.listener);
    },
  },
};
</script>
