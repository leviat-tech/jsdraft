<template>
  <div class="tool-group">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.tool-group {
  display: flex;
  align-items: center;
}

.tool-group > * + * {
  margin-left: .25rem;
}
</style>
