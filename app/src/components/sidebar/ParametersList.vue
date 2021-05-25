<template>
  <div class="sidebar-section">
    <h2>Parameters</h2>
    <div v-if="parameters">
      <parameter-input
        v-for="(p, i) in parameters"
        :key="p.id"
        v-model="overrides[i]"
        :parameter="p.parameter"
      />
    </div>
    <div v-else class="sidebar-list-item no-content">
      There are no defined parameters
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { nanoid } from 'nanoid';
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
    ...mapGetters(['draft', 'currentFeatureName']),
    parameters() {
      try {
        const file = this.draft.features.sketch[this.currentFeatureName];
        return file && file.parameters.map((p) => ({
          parameter: p,
          id: nanoid(5), // force refresh of parameter input
        }));
      } catch {
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
          this.overrides = nv.map((p) => cloneDeep(p.parameter.default));
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
