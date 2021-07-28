<template>
  <div class="sidebar-section">
    <h2>Parameters</h2>
    <div v-if="parameters">
      <parameter-input
        v-for="(p, i) in parameters"
        :key="p.id"
        v-model="localOverrides[i]"
        :parameter="p.parameter"
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
      localOverrides: [],
    };
  },
  computed: {
    ...mapState(['overrides']),
    ...mapGetters(['parameters']),
  },
  watch: {
    parameters: {
      immediate: true,
      handler(nv) {
        if (!nv) {
          this.localOverrides = [];
        } else {
          this.localOverrides = nv.map((p) => cloneDeep(p.parameter.default));
        }
      },
    },
    localOverrides: {
      handler(nv) {
        this.setOverrides(nv);
      },
    },
    overrides: {
      immediate: true,
      handler(nv, ov) {
        if (nv !== ov) this.localOverrides = nv;
      },
    },
  },
  methods: {
    ...mapMutations(['setOverrides']),
  },
};
</script>
