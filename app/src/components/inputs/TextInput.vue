<template>
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
</template>

<script>
export default {
  name: 'TextInput',
  props: {
    parameter: { type: Object, required: true },
    modelValue: { type: String, required: true },
  },
  data() {
    return {
      value: this.modelValue,
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
