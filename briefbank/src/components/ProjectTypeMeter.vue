<template lang="pug">
.project-type-scale(
  role="img"
  :aria-label="`Project type: ${label}`"
)
  .row.items-center.no-wrap.q-gutter-md
    .col-auto.scale-end-label Investigative
    .col
      q-slider.scale-slider(
        :model-value="value"
        :min="1"
        :max="5"
        :step="1"
        readonly
        color="grey-9"
        track-color="grey-4"
      )
    .col-auto.scale-end-label Product / Build
  .text-caption.text-grey-7.text-center.q-mt-none {{ label }}
</template>

<script>
import { PROJECT_TYPE_LABELS } from '@/config';

export default {
  name: 'ProjectTypeMeter',
  props: {
    value: { type: Number, required: true },
  },
  computed: {
    label() {
      return PROJECT_TYPE_LABELS[this.value] || `Type ${this.value}`;
    },
  },
};
</script>

<style scoped>
.scale-end-label {
  font-size: 0.7rem;
  color: #9e9e9e;
  white-space: nowrap;
}
.scale-slider {
  pointer-events: none;
}
.scale-slider :deep(.q-slider__selection) {
  opacity: 0;
}
</style>
