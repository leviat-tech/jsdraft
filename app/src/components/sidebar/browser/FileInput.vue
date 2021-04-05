<template>
  <div class="file-input">
    <input ref="input" v-model="file" type="text" placeholder="example.sketch.js">
  </div>
</template>


<script>
export default {
  name: 'FileInput',
  props: {
    modelValue: {
      default: '',
      type: String,
    },
  },
  data() {
    return { error: '' };
  },
  computed: {
    file: {
      get() { return this.modelValue; },
      set(v) { this.$emit('update:modelValue', v); },
    },
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
  },
};
</script>


<style lang="scss" scoped>
  @import '../../../assets/styles/variables.scss';
  @import '../../../assets/styles/inputs.scss';

  .file-input {
    padding-top: .5rem;
    @include input;
    input {
      font-size: .9rem;
      width: 325px;
      &.error {
        border-color: $color-red;
      }
    }
  }
</style>
