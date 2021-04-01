<template>
  <div class="array-container">
    <component
      :is="itemComponent"
      v-for="(item, index) in value"
      :key="index"
      v-model="value[index]"
      :parameter="itemParameter"
    />
    <div class="add-remove">
      <div class="add-remove-button" @click="removeItem">
        <img class="svg" src="icons/minus.svg">
      </div>
      <div class="add-remove-button" @click="addItem">
        <img class="svg" src="icons/plus.svg">
      </div>
    </div>
  </div>
</template>

<script>
import QuantityInput from './QuantityInput.vue';
import TextInput from './TextInput.vue';
import BooleanInput from './BooleanInput.vue';


export default {
  name: 'ArrayInput',
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
    itemType() {
      return this.parameter.items?.type
        || this.parameter.items?.cast
        || typeof this.parameter.default[0];
    },
    itemComponent() {
      return {
        string: TextInput,
        number: QuantityInput,
        boolean: BooleanInput,
        undefined: QuantityInput,
      }[this.itemType];
    },
    itemParameter() {
      const parameter = this.parameter.items || {};
      if (parameter.default === undefined) parameter.default = this.parameter.default[0];
      return parameter;
    },
    itemDefault() {
      return this.itemParameter.default;
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
  methods: {
    addItem() {
      this.value.push(this.itemDefault);
    },
    removeItem() {
      this.value.pop();
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

.add-remove {
  display: flex;
  justify-content: flex-end;
}

.add-remove-button {
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
}

.svg {
  height: 0.75rem;
  flex-grow: 1;
}
</style>
