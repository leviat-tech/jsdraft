<template>
  <div
    class="tool"
    :class="{ dark }"
  >
    <div v-if="value" class="svg" @click="value = false">
      <slot name="on" />
    </div>
    <div v-else class="svg" @click="value = true">
      <slot name="off" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tool',
  props: {
    name: { type: String, required: true },
    dark: { type: Boolean, default: false },
    modelValue: { type: Boolean, required: true },
  },
  data() {
    return {
      value: this.modelValue,
    };
  },
  watch: {
    value: {
      handler(nv) {
        this.$emit('update:modelValue', nv);
      },
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
    display: flex;
    align-items: center;
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
