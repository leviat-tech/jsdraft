<template>
  <div class="container">
    <warning-modal
      v-if="showLanguageModal"
      :title="`Warning: Switch from ${language.toUpperCase()}`"
      :text="languageModalText"
      cancel="Cancel"
      :proceed="`Switch to ${newLanguage.toUpperCase()}`"
      @cancel="showLanguageModal = false"
      @proceed="selectLanguage(newLanguage)"
    />
    <div class="header-container">
      <div class="header">
        <div class="code-icon">
          <d-button
            name="Code Symbol"
            class="code-symbol"
          >
            <code-icon class="lg" />
          </d-button>
          <div class="sketch-name">
            {{ currentFile }}
          </div>
          <tool
            name="JS"
            tool-id="js"
            text="JS"
            :selected="language"
            @click="confirmSelectLanguage('js')"
          />
          <tool
            name="YAML"
            tool-id="yaml"
            text="YAML"
            :selected="language"
            @click="confirmSelectLanguage('yaml')"
          />
        </div>
        <d-button
          name="Close Editor"
          @click="closeCodePanel"
        >
          <chevron-right-icon class="lg" />
        </d-button>
      </div>
    </div>
    <div class="codemirror-container">
      <div ref="codemirror" class="codemirror-div" />
    </div>
    <error-panel :errors="errors" />
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
import debounce from 'lodash/debounce';
import CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/addon/comment/comment.js';
import Tool from './toolbar/Tool.vue';
import DButton from './DButton.vue';
import WarningModal from './WarningModal.vue';
import ErrorPanel from './ErrorPanel.vue';
import { yaml, js } from '../utility/default-blank-sketches.js';
import ChevronRightIcon from '../assets/icons/chevron-right.svg';
import CodeIcon from '../assets/icons/code.svg';


export default {
  name: 'CodePanel',
  components: {
    WarningModal,
    Tool,
    DButton,
    ErrorPanel,
    ChevronRightIcon,
    CodeIcon,
  },
  data() {
    return {
      localCode: '',
      language: 'yaml',
      newLanguage: '',
      path: null,
      showLanguageModal: false,
      highlights: [],
    };
  },
  computed: {
    ...mapState(['currentFile']),
    ...mapGetters(['draft', 'currentFileName']),
    languageModalText() {
      return `Are you sure you want to switch from ${this.language.toUpperCase()} to ${this.newLanguage.toUpperCase()}? Changes will be lost.`;
    },
    errors() {
      if (!this.currentFileName) return null;
      return this.$store.getters.errors[this.currentFileName];
    },
    underlines() {
      if (!this.errors) return {};
      const underlines = {};
      underlines[this.errors.mark?.line] = 'error';
      return underlines;
    },
  },
  watch: {
    currentFile: {
      immediate: true,
      handler() {
        const code = this.draft.files[this.currentFileName]?.contents;
        const language = this.draft.files[this.currentFileName]?.extension;

        if (!code || !language) return;
        if (this.editor) {
          this.updateEditor(code, language);
        } else {
          this.localCode = code;
          this.language = language;
        }
      },
    },
    underlines: {
      deep: true,
      handler(nv) {
        this.highlights.forEach((highlight) => {
          this.editor.removeLineClass(highlight, 'wrap', 'line-error');
        });

        Object.keys(nv).forEach((line) => {
          if (line !== 'undefined') {
            this.highlights.push(
              this.editor.addLineClass(parseInt(line, 10), 'wrap', 'line-error'),
            );
          }
        });
      },
    },
  },
  mounted() {
    const mode = { js: 'javascript', yaml: 'yaml' }[this.language];

    this.editor = new CodeMirror(this.$refs.codemirror, {
      lineNumbers: true,
      tabSize: 2,
      value: this.localCode,
      mode,
      viewportMargin: Infinity,
    });

    this.editor.setOption('extraKeys', {
      Tab(cm) {
        const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
        cm.replaceSelection(spaces);
      },
      'Cmd-]': function indent(cm) {
        cm.execCommand('indentMore');
      },
      'Cmd-[': function dedent(cm) {
        cm.execCommand('indentLess');
      },
      'Cmd-/': function comment(cm) {
        cm.execCommand('toggleComment');
      },
    });

    this.editor.on('changes', () => {
      this.localCode = this.editor.getValue();
      this.validate();
    });
  },
  methods: {
    ...mapMutations(['setCurrentTool', 'setShowCodePanel', 'updateFile', 'removeFile']),
    closeCodePanel() {
      this.setShowCodePanel(false);
    },
    confirmSelectLanguage(language) {
      if (language === this.language) return;

      const code = {
        yaml: yaml(this.currentFileName),
        js: js(this.currentFileName),
      }[this.language];

      // If no changes from default, no need to warn
      if (this.localCode === code) {
        this.selectLanguage(language);
        return;
      }

      this.newLanguage = language;
      this.showLanguageModal = true;
    },
    updateEditor(code, language) {
      this.language = language;
      const mode = { js: 'javascript', yaml: 'yaml' }[this.language];
      this.editor.setOption('mode', mode);
      this.editor.setValue(code);
    },
    selectLanguage(language) {
      if (language === this.language) return;

      const code = {
        yaml: yaml(this.currentFileName),
        js: js(this.currentFileName),
      }[language];

      this.updateFile({ name: `${this.currentFileName}.sketch.${language}`, code });
      this.removeFile(`${this.currentFileName}.sketch.${language}`);
      this.updateEditor(code, language);
      this.showLanguageModal = false;
    },
    validate: debounce(function validate() {
      this.updateFile({
        name: `${this.currentFileName}.sketch.${this.language}`,
        code: this.localCode,
      });
    }, 500),
    selectEditor(e) {
      if (e.target.type !== 'textarea') {
        const textarea = this.$refs.prism.$refs.textarea;
        textarea.focus();
        const end = textarea.textLength;
        textarea.selectionStart = end;
        textarea.selectionEnd = end;
      }
    },
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

.toolbar-button {
  cursor: pointer;
  margin-right: 1rem;
  margin-left: 1rem;
}

.my-editor {
  font-family: $font-monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.codemirror-container {
  flex: 1 1 auto;
  margin-top: 0;
  height: 100%;
  position: relative;
}

.codemirror-div {
  height: 100%;
}

.CodeMirror {
  position:absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  height:100%;
}

</style>

<style lang="scss">
@import '../assets/styles/variables.scss';

.CodeMirror {
  height: 100%;
  font-family: $font-monospace;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.CodeMirror-gutters {
  background-color: $color-white;
  border-right: 1px solid transparent;
}

.line-error {
  background: lighten($color-red, 25);
  border-right: 2px solid $color-red;
}

</style>
