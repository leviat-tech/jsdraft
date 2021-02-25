<template>
  <div class="container">
    <div class="header-container">
      <div class="header">
        <div class="code-icon">
          <img
            class="code-symbol"
            src="icons/code.svg"
          >
          <tool
            name="JS"
            tool-id="js"
            text="JS"
            :selected="language"
            @click="selectLanguage('js')"
          />
          <tool
            name="YAML"
            tool-id="yaml"
            text="YAML"
            :selected="language"
            @click="selectLanguage('yaml')"
          />
        </div>
        <tool
          name="Close Editor"
          tool-id="close-panel"
          icon="chevron-right"
          @click="closeCodePanel"
        />
      </div>
    </div>
    <prism-editor
      ref="prism"
      v-model="localCode"
      class="my-editor"
      :highlight="highlighter"
      :line-numbers="true"
      @keydown="handleKeydown(path, $event)"
      @input="validate"
    />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { PrismEditor } from 'vue-prism-editor';
import debounce from 'lodash/debounce';
import 'vue-prism-editor/dist/prismeditor.min.css';
import { highlight, languages } from 'prismjs/components/prism-core';
import { indentText, dedentText, comment } from '../utility/text-edits.js';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import Tool from './toolbar/Tool.vue';


export default {
  name: 'CodePanel',
  components: {
    Tool,
    PrismEditor,
  },
  data() {
    return {
      localCode: '',
      path: null,
    };
  },
  computed: {
    ...mapState(['language']),
  },
  methods: {
    ...mapMutations(['setCurrentTool', 'setShowCodePanel', 'setCode', 'setLanguage']),
    closeCodePanel() {
      this.setShowCodePanel(false);
    },
    highlighter(code) {
      return highlight(code, languages[this.language]);
    },
    selectLanguage(lang) {
      this.setLanguage(lang);
    },
    handleKeydown(path, e) {
      if (e.metaKey) {
        const metaKeys = {
          '[': 'dedentSelection',
          ']': 'indentSelection',
          '/': 'comment',
        };

        if (metaKeys[e.key]) {
          e.preventDefault();
          e.stopPropagation();
          this[metaKeys[e.key]](path, e);
        }
      }
    },
    indentSelection(path, e) {
      const ss = e.target.selectionStart;
      const se = e.target.selectionEnd;

      const {
        indented,
        selectionStart,
        selectionEnd,
      } = indentText(this.localCode, ss, se);

      this.localCode = indented;
      this.$nextTick(() => {
        e.target.setSelectionRange(selectionStart, selectionEnd);
      });
    },
    dedentSelection(path, e) {
      const ss = e.target.selectionStart;
      const se = e.target.selectionEnd;

      const {
        dedented,
        selectionStart,
        selectionEnd,
      } = dedentText(this.localCode, ss, se);

      this.localCode = dedented;
      this.$nextTick(() => {
        e.target.setSelectionRange(selectionStart, selectionEnd);
      });
    },
    comment(path, e) {
      const ss = e.target.selectionStart;
      const se = e.target.selectionEnd;

      const {
        commented,
        selectionStart,
        selectionEnd,
      } = comment(this.localCode, ss, se);

      this.localCode = commented;
      this.$nextTick(() => {
        e.target.setSelectionRange(selectionStart, selectionEnd);
      });
    },
    validate: debounce(function validate() {
      this.setCode(this.localCode);
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
  align-items: center;
  padding-left: .5rem;
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

.errors {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.error .warning {
  margin-left: 1rem;
  margin-right: 1rem;
}

.toolbar-button {
  cursor: pointer;
  margin-right: 1rem;
  margin-left: 1rem;
}

.my-editor {
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}
</style>

<style lang="scss">
textarea.prism-editor__textarea {
  outline: none;
}
</style>
