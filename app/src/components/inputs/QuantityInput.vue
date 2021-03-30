<template>
  <div
    class="input-container"
    :class="{ focused }"
  >
    <input
      v-model="value"
      class="input"
      type="number"
      placeholder="Enter a value"
      :step="parameter.precision || 1"
      @keydown.enter="handleUpdate"
      @blur="handleBlur"
      @focus="focused = true"
    >
  </div>
</template>

<script>
export default {
  name: 'QuantityInput',
  props: {
    parameter: { type: Object, required: true },
    modelValue: { type: Number, required: true },
  },
  data() {
    return {
      value: this.modelValue,
      focused: false,
    };
  },
  computed: {
    minimum() {
      return this.parameter.minimum;
    },
    maximum() {
      return this.parameter.maximum;
    },
    coercedValue() {
      if (parseFloat(this.value) !== parseFloat(this.modelValue)) {
        const value = this.value * 1;
        if (this.maximum != null && this.maximum < value) return this.maximum;
        if (this.minimum != null && this.minimum > value) return this.minimum;

        return value;
      }
      return this.value;
    },
  },
  methods: {
    handleUpdate() {
      if (typeof this.coercedValue === 'number') {
        this.value = this.coercedValue;
        this.$emit('update:modelValue', this.coercedValue);
      } else {
        this.value = this.modelValue;
      }
    },
    handleBlur() {
      this.focused = false;
      this.handleUpdate();
    },
  },
};
</script>
