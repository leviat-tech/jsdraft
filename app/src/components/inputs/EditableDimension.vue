<template>
  <div
    ref="input-wrap"
    class="input-wrap"
  >
    <input
      ref="input"
      v-model="value"
      class="input"
      @keydown.enter="blur"
      @blur="blur"
    >
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import merge from 'lodash/merge';
import { createPopper } from '@popperjs/core';
import convertUnits from '../../utility/convert-units.js';


export default {
  name: 'EditableDimension',
  data() {
    return {
      instance: null,
      value: '',
      callback: null,
    };
  },
  computed: {
    ...mapState(['selectedInput', 'overrides']),
    ...mapGetters(['parameters', 'draft']),
  },
  watch: {
    selectedInput: {
      handler(dim) {
        if (!dim) return;
        this.showPopover(dim);
      },
    },
  },
  methods: {
    ...mapMutations(['setOverrides']),
    showPopover({ id, value, callback }) {
      this.value = value;
      this.callback = callback;
      const reference = document.getElementById(id);
      this.instance = createPopper(reference, this.$refs['input-wrap'], {
        placement: 'bottom',
        modifiers: {
          name: 'offset',
          options: {
            offset: [0, -20],
          },
        },
      });
      this.$refs.input.select();
    },
    blur() {
      this.recordValue();
      this.stopEditing();
    },
    recordValue() {
      const modelUnit = this.draft.settings.model_unit || 'mm';
      const plotUnit = this.draft.settings.plot_unit || modelUnit;
      let value = Number(this.value);
      if (Number.isNaN(value)) return;
      value = convertUnits(value, plotUnit, modelUnit);
      if (!this.callback) return;

      const result = this.callback(value);
      const overrides = this.parameters.map((p, index) => {
        const param = p.parameter.name;

        if (result[param]) {
          if (typeof result[param] === 'object'
            && result[param] !== null
            && !Array.isArray(result[param])) {
            return merge({}, this.overrides[index], result[param]);
          }
          return result[param];
        }

        return this.overrides[index];
      });
      this.setOverrides(overrides);
    },
    stopEditing() {
      if (this.instance) {
        this.instance.destroy();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.input-wrap {
  top: 0;
  left: 0;
  z-index: 10;
}

.input {
  background-color: transparent;
  text-align: center;
  outline: none;
  border: none;

  &:focus {
    outline: none;
  }
}
</style>
