<template lang="pug">
q-page.q-pa-md
  .row.justify-center.q-mt-lg.q-mb-xl
    .col-12.col-md-8.text-center
      .text-h4.text-bold Choose a project area
      .text-body1.q-mt-sm.text-grey-7 Browse briefs by topic and rank your preferences — supervisor identities are revealed after allocation, not before.

  .row.justify-center.q-col-gutter-md(v-if="areas.length")
    .col-12.col-sm-6.col-md-4(v-for="area of areas" :key="area.name")
      q-card.cursor-pointer.area-card.full-height(
        flat,
        bordered,
        tabindex="0",
        role="button",
        :aria-label="`Browse ${area.name} — ${area.count} briefs`",
        @click="goToArea(area)",
        @keydown.enter="goToArea(area)",
        @keydown.space.prevent="goToArea(area)"
      )
        q-card-section.bg-black.text-white
          .text-overline.q-mb-xs {{ area.count }} brief{{ area.count !== 1 ? 's' : '' }}
          .text-h6.text-bold {{ area.name }}
        q-card-section
          .text-body2.q-mb-md {{ descriptions[area.name] || '' }}
          .text-caption.text-grey-7(v-if="area.programmes") {{ area.programmes }}
        q-card-actions(align="right")
          q-btn(flat, color="black", icon-right="arrow_forward", no-caps) Browse

  .row.justify-center.q-mt-xl(v-else-if="bankError")
    .col-12.col-md-8
      q-banner.bg-negative.text-white(rounded)
        template(v-slot:avatar)
          q-icon(name="error")
        | Could not load the project brief bank. Please refresh or contact the module team.
        template(v-slot:action)
          q-btn(flat, color="white", label="Retry", @click="loadBank")

  .row.justify-center.q-mt-xl(v-else)
    .col-auto
      q-spinner(size="3em", color="black")

  .q-mt-xl
    pitch-c-t-a
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useBriefBankStore } from '@/store';
import { AREA_DESCRIPTIONS, SLUG_BY_AREA } from '@/config';
import PitchCTA from '@/components/PitchCTA.vue';

export default {
  name: 'AreaPicker',
  components: { PitchCTA },
  computed: {
    ...mapState(useBriefBankStore, ['areas', 'bankError']),
    descriptions() {
      return AREA_DESCRIPTIONS;
    },
  },
  methods: {
    ...mapActions(useBriefBankStore, ['loadBank']),
    goToArea(area) {
      const slug = SLUG_BY_AREA[area.name];
      if (slug) this.$router.push({ name: 'area', params: { slug } });
    },
  },
};
</script>

<style scoped>
.area-card:hover,
.area-card:focus {
  outline: 3px solid #000;
  outline-offset: 2px;
}
</style>
