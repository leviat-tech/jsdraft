<template>
  <div class="array-container">
    <component
      :is="property.component"
      v-for="(property, key) in properties"
      :key="key"
      v-model="value[key]"
      :label="key"
      :parameter="property"
      :type="property.type"
    />
  </div>
</template>

<script>
import QuantityInput from './QuantityInput.vue';
import TextInput from './TextInput.vue';
import BooleanInput from './BooleanInput.vue';
import GenericParameter from './GenericParameter.vue';


export default {
  name: 'ObjectInput',
  props: {
    parameter: { type: Object, required: true },
    modelValue: { type: Object, required: true },
  },
  data() {
    return {
      value: this.modelValue,
    };
  },
  computed: {
    properties() {
      let properties = {};

      const components = {
        string: TextInput,
        number: QuantityInput,
        boolean: BooleanInput,
        undefined: QuantityInput,
      };

      if (this.parameter.properties) {
        properties = Object.entries(this.parameter.properties)
          .reduce((p, [key, value]) => {
            p[key] = {
              type: value.type || value.cast || typeof this.parameter.default[key],
              name: key,
              default: this.parameter.default[key],
            };
            p[key].component = components[p[key].type] || GenericParameter;
            return p;
          }, {});
      } else {
        properties = Object.entries(this.parameter.default || {})
          .reduce((p, [key, value]) => {
            p[key] = {
              type: typeof value,
              name: key,
              default: value,
            };
            p[key].component = components[p[key].type] || GenericParameter;
            return p;
          }, {});
      }

      return properties;
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
