<template>
  <div class="sidebar-section">
    <h2>Parameters</h2>
    <div v-if="parameters">
      <parameter-input
        v-for="(parameter, i) in parameters"
        :key="i"
        :parameter="parameter"
        @mouseover="hover(i)"
        @mouseout="unhover(i)"
      />
    </div>
    <div v-else class="sidebar-list-item no-parameters">
      There are no defined parameters
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ParameterInput from './ParameterInput.vue';


export default {
  name: 'Parameters',
  components: {
    ParameterInput,
  },
  computed: {
    ...mapState(['currentFile']),
    ...mapGetters(['draft']),
    parameters() {
      const file = this.draft.files[this.currentFile];

      return file && file.parameters;
    },
  },
  methods: {
    hover(index) {
      // this.hoverEntity(index);
    },
    unhover(index) {
      // this.unhoverEntity(index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

.no-parameters {
  font-style: italic;
  color: $color-gray-06;
}
</style>
