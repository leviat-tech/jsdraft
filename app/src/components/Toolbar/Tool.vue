<template>
  <div
    class="tool"
    :class="{ active: isActive }"
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
    id: { type: String, required: true },
    icon: { type: String },
    text: { type: String },
    selected: { type: String, default: null },
  },
  computed: {
    isActive() {
      return this.selected === this.id;
    }
  }
}
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
}

</style>