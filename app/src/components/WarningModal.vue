<template>
  <modal
    :title="title"
    :header="header"
    @close="$emit('cancel')"
  >
    <div v-if="text" class="modal-text">
      {{ text }}
    </div>
    <div>
      <slot />
    </div>
    <div v-if="cancel || proceed" class="modal-buttons">
      <button v-if="cancel" class="btn cancel-button" @click="$emit('cancel')">
        {{ cancel }}
      </button>
      <button v-if="proceed" class="btn btn-danger" @click="$emit('proceed')">
        {{ proceed }}
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
    title: { type: String, default: 'Warning' },
    text: { type: String, default: 'Are you sure you want to proceed?' },
    cancel: { type: String, default: null },
    proceed: { type: String, default: 'Continue' },
    header: { type: Boolean, default: true },
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

.cancel-button {
  margin-right: 0.5rem;
}
</style>
