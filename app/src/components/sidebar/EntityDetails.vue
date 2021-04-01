<template>
  <div
    class="sidebar-list-item hoverable"
    :class="{ hovered: isHovered, selected: isSelected, expanded }"
    @click.stop="expand"
    @mouseover="hover"
    @mouseout="unhover"
  >
    <div>{{ entity }}</div>
    <div v-if="expanded" class="entity-details">
      <div v-for="(detail, name) in details" :key="name" class="detail">
        <template v-if="Array.isArray(detail)">
          <div class="detail-container">
            <div class="detail-column">{{ name }}:&nbsp;</div>
            <div class="detail-column">
              <div class="detail-line">{{ detail[0] }}</div>
              <div v-for="(d, i) in detail.slice(1)" :key="i" class="detail-line">
                {{ d }}
              </div>
            </div>
          </div>
        </template>
        <div v-else class="detail-line">
          {{ name }}: {{ detail }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';


export default {
  name: 'EntityDetails',
  props: {
    details: { type: Object, required: true },
    entity: { type: String, required: true },
    index: { type: Number, required: true },
  },
  data() {
    return {
      expanded: false,
    };
  },
  computed: {
    ...mapState(['hovered', 'selected']),
    isHovered() {
      return this.hovered === this.index;
    },
    isSelected() {
      return this.selected[this.index];
    },
  },
  watch: {
    isSelected: {
      handler(nv) {
        if (nv) this.expanded = true;
      },
    },
  },
  methods: {
    ...mapMutations(['setHovered', 'setSelected']),
    hover() {
      this.setHovered(this.index);
    },
    unhover() {
      this.setHovered(null);
    },
    expand() {
      if (!this.isSelected) {
        this.setSelected({ [this.index]: true });
      } else {
        this.expanded = !this.expanded;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

.entity-details {
  color: $color-gray-08;
  font-size: $text-xs;
  margin-top: 0.5rem;
}

.detail, .detail-line {
  margin-bottom: 0.25rem;
}

.detail-container {
  display: flex;
}

</style>
