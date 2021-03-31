<template>
  <div class="entity-details">
    <div v-for="(detail, name) in details" :key="name" class="detail">
      {{ name }}: {{ detail }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'EntityDetails',
  props: {
    details: { type: Object, required: true },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

.entity-details {
  color: $color-black;
  font-size: $text-xs;
  margin-top: 0.5rem;
}

.detail {
  margin-bottom: 0.25rem;
}
</style>
