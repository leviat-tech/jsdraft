<template>
  <div class="sidebar-section">
    <h2>Parameters</h2>
    <div v-if="parameters">
      <parameter-input
        v-for="(parameter, i) in parameters"
        :key="i"
        v-model="overrides[i]"
        :parameter="parameter"
      />
    </div>
    <div v-else class="sidebar-list-item no-content">
      There are no defined parameters
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import ParameterInput from './ParameterInput.vue';


export default {
  name: 'ParameterList',
  components: {
    ParameterInput,
  },
  data() {
    return {
      overrides: [],
    };
  },
  computed: {
    ...mapState(['currentFile']),
    ...mapGetters(['draft']),
    parameters() {
      try {
        const file = this.draft.files[this.currentFile];
        return file && file.parameters;
      } catch (e) {
        return null;
      }
    },
  },
  watch: {
    parameters: {
      immediate: true,
      handler(nv) {
        if (!nv) {
          this.overrides = [];
        } else {
          this.overrides = nv.map((p) => cloneDeep(p.default));
        }
      },
    },
    overrides: {
      handler(nv) {
        this.setOverrides(nv);
      },
    },
  },
  methods: {
    ...mapMutations(['setOverrides']),
  },
};
</script>
