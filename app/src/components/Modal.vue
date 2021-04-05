<template>
  <div
    class="background"
    @click.self="$emit('close')"
  >
    <div class="modal">
      <div
        v-show="header"
        class="modal-header"
        :class="{ title }"
      >
        <div class="title-text">
          {{ title }}
        </div>
        <d-button
          name="Delete"
          class="delete-button"
          @click="$emit('close')"
        >
          <times-icon class="svg-inline lg" />
        </d-button>
      </div>
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import DButton from './DButton.vue';
import TimesIcon from '../assets/icons/times.svg';


export default {
  name: 'Modal',
  components: {
    DButton,
    TimesIcon,
  },
  props: {
    title: {
      type: String,
      default: null,
    },
    closeable: {
      type: Boolean,
      default: true,
    },
    header: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';


.background {
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.1)
}

.modal {
  background-color: $color-white;
  max-width: 24rem;
  border-radius: $radius;
  display: flex;
  flex-direction: column;
  align-items: center;

  @include shadow;
}

.modal-header {
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 0.75rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.title {
    border-bottom: $border-sm solid $color-gray-03;
  }

  .title-text {
    color: $color-gray-06;
    font-size: $text-sm;
  }
}

.delete-button {
  color: $color-gray-06;
}

.modal-content {
  padding: 1.5rem;
}
</style>
