<template>
  <div
    class="input-container"
    :class="{ focused }"
  >
    <div v-if="label" class="label">
      {{ label }}
    </div>
    <input
      v-model="value"
      class="input"
      type="number"
      placeholder="Enter a value"
      :step="parameter.precision || 1"
      @input="handleUpdate"
      @blur="focused = false"
      @focus="focused = true"
    >
  </div>
</template>

<script>
export default {
  name: 'QuantityInput',
  props: {
    parameter: { type: Object, required: true },
    label: { type: String, default: null },
    modelValue: { type: Number, default: 0 },
  },
  data() {
    return {
      value: this.modelValue,
      focused: false,
    };
  },
  computed: {
    min() {
      return this.parameter.min;
    },
    max() {
      return this.parameter.max;
    },
    coercedValue() {
      if (parseFloat(this.value) !== parseFloat(this.modelValue)) {
        const value = this.value * 1;
        if (this.max != null && this.max < value) return this.max;
        if (this.min != null && this.min > value) return this.min;

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
  },
};
</script>
