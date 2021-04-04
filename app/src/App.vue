<template>
  <div id="app">
    <layout />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import isElectron from 'is-electron';
import Layout from './components/Layout.vue';


const electron = isElectron();

export default {
  name: 'App',
  components: {
    Layout,
  },
  computed: {
    ...mapState(['path', 'draft']),
  },
  watch: {
    path: {
      immediate: true,
      async handler(nv) {
        if (electron) {
          if (this.closeWatcher) {
            await this.closeWatcher();
          }

          if (nv) {
            this.closeWatcher = window.electron.watchDirectory(nv, this.updateDraftFile);
          }
        }
      },
    },
  },
  unmounted() {
    if (this.closeWatcher) this.closeWatcher();
  },
  methods: {
    ...mapMutations(['updateFile', 'removeFile']),
    updateDraftFile(updateType, file) {
      if (updateType === 'change') {
        this.updateFile({
          name: `${file.name}.sketch.${file.extension}`,
          code: file.contents,
        });
      }

      if (updateType === 'unlink') {
        this.removeFile(`${file.name}.sketch.${file.extension}`);
      }
    },
  },
};
</script>

<style lang="scss">
@import './assets/styles/variables.scss';

html {
  height: 100%;
  font-family: "system-ui",
    "BlinkMacSystemFont",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    "sans-serif";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
}

body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e2e8f0;
}

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
figure,
p,
pre {
  margin: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: bold;
}

h1 {
  font-size: 1.5rem;
}

h2 {
  font-weight: bold;
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
  background-color: white;
}

.divider {
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  border-top: 1px solid $color-gray-03;
}

.svg-inline {
  font-size: inherit;
  overflow: visible;
  display: inline-block;
  height: .8em;
  vertical-align: -0.1em;

  &.xs {
    font-size: $text-xs;
  }

  &.sm {
    font-size: $text-sm;
  }

  &.md {
    font-size: $text-base;
  }

  &.lg {
    font-size: $text-lg;
  }

  &.xl {
    font-size: $text-xl;
  }

  &.xxl {
    font-size: $text-2xl;
  }

  &.xxxl {
    font-size: $text-3xl;
  }
}

.btn {
  padding: 0.25rem 0.75rem;
  font-weight: bold;
  font-size: $text-sm;
  border-radius: $radius;
  height: 2rem;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
  appearance: none;
  text-decoration: none;
  cursor: pointer;

  &.btn-default {
    color: $color-gray-09;
    background: linear-gradient($color-white, $color-gray-03);

    &:hover {
      background: linear-gradient($color-gray-01, $color-gray-03);
    }

    &:active, &.active {
      background: $color-gray-03;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15),
        inset 0 1px 3px rgba(0, 0, 0, 0.15);
    }
  }

  &.btn-primary {
    color: $color-white;
    background: linear-gradient(#209cef, #1985dd);

    &:hover {
      background: linear-gradient(#168fd3, #126fcc);
    }

    &:active, &.active {
      background: #0e5fc1;
    }
  }

  &.btn-danger {
    color: $color-white;
    background-color: $color-red;

    &:hover {
      background-color: #cf3945;
      border-color: rgba(27, 31, 35, 0.5);
    }

    &:active, &.active {
      background: #ac0211;
    }
  }

  &.btn-danger-minimal {
    color: $color-red;
    background-color: transparent;
    border: none;

    &:hover {
      color: #cf3945;
    }

    &:active {
      color: #ac0211;
    }
  }
}

.sidebar-section {
  padding-top: 1rem;
  padding-bottom: 1rem;
  h2 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
.sidebar-list-item {
  font-size: $text-sm;
  padding: 0.5rem 1rem 0.5rem 1rem;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;

  &.hoverable {
    &:hover, &.hovered {
      background-color: $color-gray-02;
      border-top-color: $color-gray-03;
      border-bottom-color: $color-gray-03;
    }
  }

  &.selected {
    border-color: $color-gray-03;
    background-color: $color-gray-01;
  }
}

.no-content {
  font-style: italic;
  color: $color-gray-06;
}

.input-container {
  min-width: 0;
  border: $border-sm solid;
  border-color: $color-gray-03;
  border-radius: $radius;
  background-color: $color-gray-01;
  flex: 1 1 0%;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;

  font-size: $text-xs;
  min-height: 1.75rem;

  .label {
    height: 1.5rem;
    line-height: 1.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-right: 1px solid $color-gray-03;
    color: $color-gray-08;
  }

  &:focus, &.focused {
    color: $color-black;
    border: $border-sm solid $color-blue;
    box-shadow: 0px 0px 0px 1px $color-blue;
  }

  select, input {
    outline: none;
    min-width: 0;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    font-size: $text-base;
    appearance: none;
    background-color: transparent;
    border: none;
    flex: 1 1 0%;

    font-size: $text-xs;
    height: 1.5rem;
  }
}

</style>
