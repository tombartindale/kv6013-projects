<template lang="pug">
.project-type-meter
  .row.items-center.no-wrap.q-col-gutter-xs(v-if="!compact")
    .col-auto.text-caption.text-grey-6(aria-hidden="true") Investigation
    .col
      .row.no-wrap.items-center.q-col-gutter-xs(
        role="img",
        :aria-label="`Project type ${value} out of 5 — ${label}`"
      )
        .col-auto(v-for="i in 5" :key="i")
          .type-dot(:class="{ active: i <= value }")
    .col-auto.text-caption.text-grey-6(aria-hidden="true") Build
  .row.no-wrap.items-center.q-col-gutter-xs(
    v-else,
    role="img",
    :aria-label="`Project type: ${label}`"
  )
    .col-auto(v-for="i in 5" :key="i")
      .type-dot.small(:class="{ active: i <= value }")
  .text-caption.text-grey-6.q-mt-xs {{ label }}
</template>

<script>
import { PROJECT_TYPE_LABELS } from '@/config';

export default {
  name: 'ProjectTypeMeter',
  props: {
    value: { type: Number, required: true },
    compact: { type: Boolean, default: false },
  },
  computed: {
    label() {
      return PROJECT_TYPE_LABELS[this.value] || `Type ${this.value}`;
    },
  },
};
</script>

<style scoped>
.type-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background: #fff;
  display: inline-block;
  flex-shrink: 0;
}
.type-dot.active {
  background: #111;
  border-color: #111;
}
.type-dot.small {
  width: 10px;
  height: 10px;
}
</style>
