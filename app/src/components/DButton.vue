<template>
  <div
    class="button"
  >
    <slot />
    <img
      v-if="icon"
      :class="size"
      :src="`icons/${icon}.svg`"
    >
    <div v-if="text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'DButton',
  props: {
    name: { type: String, required: true },
    icon: { type: String, default: null },
    text: { type: String, default: null },
    size: {
      type: String,
      default: 'lg',
      validator: (prop) => ['lg', 'md', 'sm', 'xs'].includes(prop),
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';

.button {
  padding: 0.25rem;
  text-align: center;
  display: flex;
  align-items: center;
  cursor: pointer;
}

</style>

<style lang="scss">
@import '../assets/styles/variables.scss';

.svg-inline {
  height: 1.25rem;
  flex-grow: 1;

  &.xs {
    height: $text-xs;
  }

  &.sm {
    height: $text-sm;
  }

  &.md {
    height: $text-base;
  }

  &.lg {
    height: $text-lg;
  }
}
</style>
