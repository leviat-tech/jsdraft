<template>
  <div class="file-browser">
    <file-header />
    <div class="file-browser-contents">
      <file-tab v-for="file in files" :key="file.name" :file="file" />
      <div v-if="files.length === 0" class="empty">
        Click the plus to add a new feature.
      </div>
    </div>
  </div>
</template>


<script>
import FileHeader from './FileHeader.vue';
import FileTab from './FileTab.vue';


function fileList(files, path = '') {
  return Object.entries(files)

    // sort alphabetically
    .sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    })

    // add to list
    .reduce((list, [name, contents]) => {
      const p = path ? `${path}/${name}` : name;
      const type = typeof contents === 'object' ? 'folder' : 'file';

      if (name && contents !== null) {
        list.push({
          name,
          path: p,
          type,
          contents: type === 'folder' ? fileList(contents, p) : contents,
        });
      }
      return list;
    }, []);
}

export default {
  name: 'FileBrowser',
  components: {
    FileHeader,
    FileTab,
  },
  computed: {
    files() {
      return fileList(this.$store.state.files);
    },
  },
};
</script>


<style lang="scss" scoped>
  @import '../../../assets/styles/variables.scss';
  .file-browser {
    max-height: min(20rem, 50%);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .empty {
      font-size: .8rem;
      text-align: center;
      padding: 1rem 0rem;
      color: $color-gray-08
    }

    .file-browser-contents {
      overflow-y: auto;
    }
  }
</style>
