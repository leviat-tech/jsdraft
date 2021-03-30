<template>
  <div class="param-container">
    <div class="param-label">{{ parameter.name }}</div>
    <div
      class="input-container"
      :class="{ focused }"
    >
      <input
        v-model="value"
        class="input"
        type="text"
        placeholder="Enter a value"
        @keydown.enter="handleUpdate"
        @blur="handleBlur"
        @focus="focused = true"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParameterInput',
  props: {
    parameter: { type: Object, required: true },
  },
  data() {
    return {
      value: this.parameter.default,
      focused: false,
    };
  },
  methods: {
    handleUpdate() {
      this.$emit('update:modelValue', this.value);
    },
    handleBlur() {
      this.focused = false;
      this.handleUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

.param-container {
  display: flex;
  align-items: center;
  padding: 0.25rem 1rem 0.25rem 1rem;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  font-size: $text-xs;
}

.param-label {
  flex: none;
  width: 35%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.input-container {
  min-width: 0;
  border: $border-sm solid;
  border-color: $color-gray-03;
  border-radius: $radius;
  background-color: $color-gray-01;
  flex: 1 1 0%;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;

  font-size: $text-xs;
  min-height: 1.75rem;

  &:focus, &.focused {
    color: $color-black;
    border: $border-sm solid $color-blue;
    box-shadow: 0px 0px 0px 1px $color-blue;
  }

  select, input {
    outline: none;
    min-width: 0;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    height: 2rem;
    font-size: $text-base;
    appearance: none;
    background-color: transparent;
    border: none;
    flex: 1 1 0%;

    font-size: $text-xs;
    height: 1.5rem;
  }
}

</style>
