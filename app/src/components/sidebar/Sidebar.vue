<template>
  <div class="sidebar">
    <div class="header">
      Draft
    </div>
    <div class="panels" />

    <div class="tree" />
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  components: {
  },
  data() {
    return {
      showParamForm: false,
    };
  },
  computed: {
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

h2 {
  font-weight: bold;
  font-size: 1rem;
  margin: 0 0 0 0;
}

button {
  background-color: #ddd;
  border: 0;
  border-radius: $radius;
}

.header {
  font-size: 1rem;
  width: 100%;
  background-color: $color-gray-01;
  border-bottom: $border-sm solid $color-gray-03;
  line-height: 3rem;
  min-height: 3rem;
  padding-left: .25rem;
  padding-right: .25rem;
  text-align: center;
  font-weight: bold;
}

.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: $border-sm solid $color-gray-03;
}

.tree {
  border-top: $border-sm solid $color-gray-03;
  margin-bottom: 0.5rem;
  padding-top: 1rem;
  padding-left: 1rem;
}

.draft-editor {
  border-left: $border-sm solid $color-gray-03;
}

.panels {
  overflow: hidden;
}

</style>
