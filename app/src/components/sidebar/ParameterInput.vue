<template>
  <div class="param-container">
    <div class="param-label">{{ parameter.name }}</div>
    <component
      :is="dynamicInput"
      v-model="value"
      :parameter="parameter"
      :type="type"
    />
  </div>
</template>

<script>
import QuantityInput from '../inputs/QuantityInput.vue';
import TextInput from '../inputs/TextInput.vue';
import BooleanInput from '../inputs/BooleanInput.vue';
import ArrayInput from '../inputs/ArrayInput.vue';
import PointInput from '../inputs/PointInput.vue';
import GenericParameter from '../inputs/GenericParameter.vue';


export default {
  name: 'ParameterInput',
  props: {
    parameter: { type: Object, required: true },
    modelValue: { type: [Number, String, Boolean, Array, Object], default: undefined },
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
        boolean: BooleanInput,
        array: ArrayInput,
        point: PointInput,
        undefined: QuantityInput,
      }[this.type] || GenericParameter;
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
  align-items: flex-start;
  padding: 0.25rem 1rem 0.25rem 1rem;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  font-size: $text-xs;
}

.param-label {
  flex: none;
  width: 35%;
  line-height: 1.75rem;
  min-height: 1.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
