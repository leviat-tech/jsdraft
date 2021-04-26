<template>
  <warning-modal
    v-if="showing"
    :header="false"
    text=""
    cancel="Cancel"
    proceed="Delete"
    class="delete-modal"
    @cancel="showing = false"
    @proceed="remove"
  >
    <div class="instructions">
      Are you sure you wish to delete <span class="highlight">{{ file.name }}</span> ?
    </div>
  </warning-modal>
</template>


<script>
import WarningModal from '../../WarningModal.vue';


export default {
  name: 'DeleteModal',
  components: {
    WarningModal,
  },
  props: {
    file: { type: Object, required: true },
  },
  data() {
    return {
      showing: false,
    };
  },
  methods: {
    open() {
      this.showing = true;
    },
    close() {
      this.showing = false;
    },
    remove() {
      this.$store.commit('removeFile', this.file.path);
    },
  },
};
</script>


<style lang="scss" scoped>
  @import '../../../assets/styles/variables.scss';

  .delete-modal {
    .instructions {
      color: $color-gray-09;
      font-size: .9rem;
      padding: .5rem 0rem 1.5rem 0rem;
    }
    .highlight {
      font-weight: bold;
    }
  }
</style>
