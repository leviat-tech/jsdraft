<template>
  <div class="array-container">
    <quantity-input
      v-model="value[0]"
      label="x"
      :parameter="xParam"
    />
    <quantity-input
      v-model="value[1]"
      label="y"
      :parameter="yParam"
    />
  </div>
</template>

<script>
import QuantityInput from './QuantityInput.vue';


export default {
  name: 'PointInput',
  components: {
    QuantityInput,
  },
  props: {
    parameter: { type: Object, required: true },
    modelValue: { type: Array, required: true },
  },
  data() {
    return {
      value: this.modelValue,
    };
  },
  computed: {
    xParam() {
      return {
        default: this.parameter.default && this.parameter.default[0],
      };
    },
    yParam() {
      return {
        default: this.parameter.default && this.parameter.default[1],
      };
    },
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.$emit('update:modelValue', this.value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';


.array-container {
  min-width: 0;
  flex: 1 1 0%;
  width: 100%;
  position: relative;
}

.array-container > * + * {
  margin-top: 0.25rem;
}

</style>
