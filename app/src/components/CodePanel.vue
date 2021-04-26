<template>
  <div class="container">
    <!-- tool bar -->
    <div class="header-container">
      <div class="header">
        <div class="code-icon">
          <d-button name="Code Symbol" class="code-symbol" @click="closeCodePanel">
            <code-icon class="lg" />
          </d-button>
          <div class="sketch-name">
            {{ currentFile }}
          </div>
        </div>
        <d-button name="Close Editor" @click="closeCodePanel">
          <chevron-right-icon class="lg" />
        </d-button>
      </div>
    </div>

    <!-- code -->
    <code-editor
      v-if="localCode"
      v-model="localCode"
      :language="language"
      :underlines="underlines"
      @save="save"
    />

    <!-- error panel -->
    <error-panel :errors="errors" />
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';
import debounce from 'lodash/debounce';
import CodeEditor from './CodeEditor.vue';
import DButton from './DButton.vue';
import ErrorPanel from './ErrorPanel.vue';
import ChevronRightIcon from '../assets/icons/chevron-right.svg';
import CodeIcon from '../assets/icons/code.svg';


export default {
  name: 'CodePanel',
  components: {
    CodeEditor,
    DButton,
    ErrorPanel,
    ChevronRightIcon,
    CodeIcon,
  },
  data() {
    return {
      localCode: '',
      newLanguage: '',
      path: null,
    };
  },
  computed: {
    ...mapState(['currentFile']),
    ...mapGetters(['draft', 'currentFeatureName']),
    language() {
      return this.draft.features.sketch[this.currentFeatureName]?.extension;
    },
    errors() {
      if (!this.currentFeatureName) return null;
      return this.$store.getters.errors[this.currentFeatureName];
    },
    underlines() {
      if (!this.errors) return {};
      const underlines = {};
      underlines[this.errors.mark?.line] = 'error';
      return underlines;
    },
    currentCode() {
      return this.draft.features.sketch[this.currentFeatureName]?.contents;
    },
  },
  watch: {
    currentFile: {
      immediate: true,
      handler() {
        this.localCode = this.currentCode;
      },
    },
    localCode: {
      handler() {
        this.validate();
      },
    },
    currentCode: {
      handler() {
        this.localCode = this.currentCode;
      },
    },
  },
  methods: {
    ...mapMutations(['setCurrentTool', 'setShowCodePanel', 'updateFile']),
    ...mapActions(['save']),
    closeCodePanel() {
      this.setShowCodePanel(false);
    },
    validate: debounce(function validate() {
      if (this.currentFeatureName && this.language) {
        this.updateFile({
          path: `${this.currentFeatureName}.${this.language}`,
          code: this.localCode,
        });
      }
    }, 500),
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: $border-sm solid $color-gray-03;
  background: white;
}

.header-container {
  width: 100%;
  background-color: $color-gray-01;
  border-bottom: $border-sm solid $color-gray-03;
}

.code-symbol {
  height: 1.25rem;
  margin-right: 1rem;
}

.header {
  font-size: 1rem;
  line-height: 3rem;
  min-height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: .25rem;
  padding-right: .25rem;
}

.code-icon {
  display: flex;
  width: 100%;
  align-items: center;
  padding-left: .5rem;
  padding-right: 1rem;
}

.footer {
  font-size: 1rem;
  width: 100%;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  border-top: $border-sm solid $color-gray-03;
  border-bottom: $border-sm solid $color-gray-03;
  height: 3rem;
  line-height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .message {
    display: flex;
    align-items: center;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
  }
  .show-errors {
    cursor: pointer;
    margin-right: 1.5rem;
  }
}

.sketch-name {
  flex-grow: 1;
}

.errors {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.error .warning {
  margin-left: 1rem;
  margin-right: 1rem;
}

</style>
