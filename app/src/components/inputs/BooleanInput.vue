<template>
  <div
    class="boolean-container"
    :class="{ focused }"
  >
    <input
      v-model="value"
      class="input"
      type="checkbox"
      @focus="focused = true"
    >
  </div>
</template>

<script>
export default {
  name: 'BooleanInput',
  props: {
    parameter: { type: Object, required: true },
    modelValue: { type: Boolean, required: true },
  },
  data() {
    return {
      value: this.modelValue,
      focused: false,
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
.boolean-container {
  min-height: 1.75rem;
  line-height: 1.75rem;
  align-items: center;
}
</style>
