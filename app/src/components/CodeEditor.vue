<template>
  <div class="codemirror-container">
    <div ref="codemirror" class="codemirror-div" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/addon/comment/comment.js';


export default {
  name: 'CodeEditor',
  props: {
    modelValue: { type: String, required: true },
    language: { type: String, default: 'js' },
    underlines: { type: Object, default: () => {} },
  },
  data() {
    return {
      highlights: [],
    };
  },
  watch: {
    modelValue: {
      handler(nv) {
        if (nv !== this.editor.getValue()) {
          this.editor.setValue(nv);
          this.editor.clearHistory();
        }
      },
    },
    language: {
      handler(nv) {
        const mode = { js: 'javascript', json: 'javascript', yaml: 'yaml' }[nv];
        this.editor.setOption('mode', mode);
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
    const mode = { js: 'javascript', yaml: 'yaml', json: 'javascript' }[this.language];

    this.editor = new CodeMirror(this.$refs.codemirror, {
      lineNumbers: true,
      tabSize: 2,
      value: this.modelValue,
      mode,
      viewportMargin: Infinity,
    });

    this.editor.setOption('extraKeys', {
      Tab(cm) {
        if (cm.somethingSelected()) {
          cm.execCommand('indentMore');
        } else {
          cm.execCommand('insertSoftTab');
        }
      },
      'Shift-Tab': (cm) => cm.execCommand('indentLess'),
      'Cmd-/': function comment(cm) {
        cm.execCommand('toggleComment');
      },
      'Ctrl-/': function comment(cm) {
        cm.execCommand('toggleComment');
      },
      'Cmd-S': function save() {
        this.$emit('save');
      }.bind(this),
      'Ctrl-S': function save() {
        this.$emit('save');
      }.bind(this),
    });

    this.editor.on('changes', () => {
      this.$emit('update:modelValue', this.editor.getValue());
    });
  },
};
</script>

<style lang="scss" scoped>
.codemirror-container {
  flex: 1 1 auto;
  margin-top: 0;
  height: 100%;
  position: relative;
  overflow-y: hidden;
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
