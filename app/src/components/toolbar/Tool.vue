<template>
  <div
    class="tool"
    :class="{ active: isActive, dark }"
  >
    <img
      v-if="icon"
      class="svg"
      :src="`icons/${icon}.svg`"
    >
    <div v-else>{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'Tool',
  props: {
    name: { type: String, required: true },
    toolId: { type: String, required: true },
    icon: { type: String, default: null },
    text: { type: String, default: null },
    selected: { type: String, default: null },
    dark: { type: Boolean, default: false },
  },
  computed: {
    isActive() {
      return this.selected === this.toolId;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

.tool {
  min-width: 2rem;
  height: 2rem;
  line-height: 2rem;
  padding: 0.25rem;
  text-align: center;
  display: flex;
  align-items: center;
  border: $border-sm solid transparent;
  cursor: pointer;

  &:hover {
    background-color: $color-gray-01;
    border: $border-sm solid $color-gray-04;
    border-radius: $radius;
  }

  &.active, &:active {
    background-color: $color-gray-03;
    border: $border-sm solid $color-gray-04;
    border-radius: $radius;
  }

  .svg {
    height: 1.25rem;
    flex-grow: 1;
  }

  &.dark {
    &:hover {
      background-color: $color-gray-08;
      border-color: $color-gray-07;
    }

    &.active, &:active {
      background-color: $color-gray-08;
      border-color: $color-gray-07;
    }
  }
}

</style>
