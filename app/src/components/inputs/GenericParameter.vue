<template>
  <div
    class="input-container"
  >
    <div class="param">
      {{ upperFirst(type) }}
    </div>
  </div>
</template>

<script>
import upperFirst from 'lodash/upperFirst';


export default {
  name: 'GenericParameter',
  props: {
    parameter: { type: Object, required: true },
    type: { type: String, required: true },
  },
  methods: {
    upperFirst,
  },
};
</script>

<style lang="scss" scoped>
.param {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
</style>
