<template>
  <div id="app">
    <layout />
  </div>
</template>

<script setup>
import Layout from './components/Layout.vue'
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
  font-size: 1.25rem;
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

</style>