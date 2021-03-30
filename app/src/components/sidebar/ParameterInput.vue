<template>
  <div class="param-container">
    <div class="param-label">{{ parameter.name }}</div>
    <component
      :is="dynamicInput"
      v-model="value"
      :parameter="parameter"
    />
  </div>
</template>

<script>
import QuantityInput from '../inputs/QuantityInput.vue';
import TextInput from '../inputs/TextInput.vue';


export default {
  name: 'ParameterInput',
  props: {
    parameter: { type: Object, required: true },
    modelValue: { type: [Number, String, Boolean, Array, Object], required: true },
  },
  data() {
    return {
      value: this.modelValue,
      focused: false,
    };
  },
  computed: {
    type() {
      return this.parameter.type
        || this.parameter.cast
        || (Array.isArray(this.parameter.default) && 'array')
        || typeof this.parameter.default;
    },
    dynamicInput() {
      return {
        string: TextInput,
        number: QuantityInput,
      }[this.type];
    },
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

</style>
