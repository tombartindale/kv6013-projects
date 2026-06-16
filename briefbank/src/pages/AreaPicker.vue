<template lang="pug">
q-page.q-pa-md
  .row.justify-center.q-mt-lg.q-mb-lg
    .col-12.col-md-10.col-lg-8.text-center
      .text-h4.text-bold Choose a project area
      .text-body1.q-mt-sm.text-grey-7 Browse briefs by topic and rank your preferences — supervisor identities are revealed after allocation, not before.

  .row.justify-center.q-mb-xl
    .col-12.col-md-10.col-lg-8
      .how-it-works
        .flow-step
          .flow-num 1
          .flow-body
            .text-subtitle2.text-bold Pick a theme
            .text-body2.text-grey-8 Choose the project area that best matches your interests — AI, Cyber, Data, HCI, or Games.
        .flow-connector
          q-icon(name="arrow_forward", color="grey-4", size="20px")
        .flow-step
          .flow-num 2
          .flow-body
            .text-subtitle2.text-bold Browse &amp; select 4 briefs
            .text-body2.text-grey-8 Read the briefs and add your four favourites to your shortlist.
        .flow-connector
          q-icon(name="arrow_forward", color="grey-4", size="20px")
        .flow-step
          .flow-num 3
          .flow-body
            .text-subtitle2.text-bold Submit your preferences
            .text-body2.text-grey-8 Complete the preferences form with your top 4 choices, ranked in order.
        .flow-connector
          q-icon(name="arrow_forward", color="grey-4", size="20px")
        .flow-step
          .flow-num 4
          .flow-body
            .text-subtitle2.text-bold Get allocated &amp; refine
            .text-body2.text-grey-8 You are allocated a brief and introduced to your supervisor, who works with you to shape it into your own project.

  .row.justify-center.q-col-gutter-md(v-if="areas.length")
    .col-12.col-sm-6.col-md-4(v-for="area of areas" :key="area.name")
      q-card.cursor-pointer.area-card.full-height(
        flat,
        bordered,
        square,
        tabindex="0",
        role="button",
        :aria-label="`Browse ${area.name} — ${area.count} briefs`",
        @click="goToArea(area)",
        @keydown.enter="goToArea(area)",
        @keydown.space.prevent="goToArea(area)"
      )
        q-card-section
          .text-h5.text-bold.text-uppercase {{ area.name }}
        q-separator
        q-card-section
          .text-body1.text-grey-8 {{ descriptions[area.name] || '' }}
          .text-body2.text-grey-6.q-mt-sm {{ area.count }} brief{{ area.count !== 1 ? 's' : '' }}

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
.how-it-works {
  display: flex;
  align-items: flex-start;
  gap: 0;
}
.flow-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}
.flow-connector {
  padding-top: 8px;
  flex-shrink: 0;
  padding-left: 8px;
  padding-right: 8px;
}
.flow-num {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #111;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.flow-body {
  padding-top: 4px;
}
@media (max-width: 599px) {
  .how-it-works {
    flex-direction: column;
    gap: 4px;
  }
  .flow-connector {
    padding: 0;
    margin-left: 8px;
    transform: rotate(90deg);
  }
}
</style>
