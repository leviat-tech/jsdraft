<template>
  <div id="app">
    <layout />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import isElectron from 'is-electron';
import Layout from './components/Layout.vue';


export default {
  name: 'App',
  components: {
    Layout,
  },
  data() {
    return {
      isElectron: isElectron(),
      closeWatcher: null,
    };
  },
  computed: {
    ...mapState(['path', 'draft']),
  },
  watch: {
    path: {
      immediate: true,
      async handler(nv) {
        if (this.isElectron) {
          if (this.closeWatcher) {
            await this.closeWatcher();
          }

          if (nv) {
            this.closeWatcher = window.electron.watchDirectory(nv, this.updateFile);
          }
        }
      },
    },
  },
  unmounted() {
    if (this.closeWatcher) this.closeWatcher();
  },
  methods: {
    ...mapMutations(['updateSketch', 'removeSketch']),
    updateFile(updateType, file) {
      if (updateType === 'change') {
        this.updateSketch({
          name: file.name,
          language: file.extension,
          code: file.contents,
        });
      }

      if (updateType === 'unlink') {
        this.removeSketch(file.name);
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

</style>
