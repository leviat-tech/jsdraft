<template>
  <modal
    title="Export File"
    :header="true"
    @close="$emit('cancel')"
  >
    <div class="modal-text">
      Export file type:
    </div>
    <div class="modal-buttons">
      <button class="btn btn-primary" @click="$emit('export', 'svg')">
        SVG
      </button>
      <button class="btn btn-primary" @click="$emit('export', 'dxf')">
        DXF
      </button>
    </div>
  </modal>
</template>

<script>
import Modal from './Modal.vue';


export default {
  name: 'WarningModal',
  components: {
    Modal,
  },
  props: {
    cancel: { type: String, default: null },
  },
};
</script>

<style lang="scss" scoped>
.modal-text {
  margin-bottom: 1rem;
}

.modal-buttons {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

.modal-buttons > * + * {
  margin-left: 0.5rem;
}

.cancel-button {
  margin-right: 0.5rem;
}
</style>
