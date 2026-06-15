<template lang="pug">
q-page.q-pa-md
  .row.justify-center
    .col-12.col-md-8.text-center.q-mt-xl
      q-icon(name="check_circle", size="5rem", color="positive")
      .text-h5.text-bold.q-mt-md Ranking submitted
      .text-body1.text-grey-7.q-mt-sm(v-if="submitted")
        | Keep a note of your choices below.
        br
        | You'll be contacted about your allocation by the module team.

  .row.justify-center.q-mt-xl(v-if="submitted")
    .col-12.col-md-8
      q-card(flat, bordered)
        q-card-section
          .text-overline.text-grey-7 Module
          .text-body2 {{ submitted.module }}
        q-separator
        q-card-section
          .text-overline.text-grey-7 Area
          .text-body1.text-bold {{ submitted.area }}
        q-separator
        q-card-section
          .text-overline.text-grey-7 Your ranked choices
          .q-mt-sm
            .row.items-start.q-mb-sm(v-for="(id, idx) of submitted.ranking" :key="id")
              .text-h6.text-bold.text-grey-4.q-mr-md(style="min-width: 28px") {{ idx + 1 }}
              .col
                .text-body1.text-bold {{ titleById(id) }}
                .text-caption.text-grey-6 {{ id }}
        q-separator
        q-card-section
          .text-overline.text-grey-7 Submitted
          .text-body2 {{ formatDate(submitted.submitted_at) }}
        q-separator
        q-card-section
          details
            summary.text-caption.text-grey-7.cursor-pointer View submission payload
            pre.q-mt-sm.bg-grey-1.q-pa-sm(
              style="font-size: 11px; overflow-x: auto; white-space: pre-wrap"
            ) {{ JSON.stringify(submitted, null, 2) }}

      .row.justify-center.q-mt-xl
        q-btn(unelevated, color="black", :to="'/'", label="Back to areas")

  .row.justify-center.q-mt-xl(v-else)
    .col-auto.text-center
      .text-body1.text-grey-7 No submission found.
      q-btn.q-mt-md(unelevated, color="black", :to="'/shortlist'", label="Go to shortlist")

  .q-mt-xl
    pitch-c-t-a
</template>

<script>
import { mapState } from 'pinia';
import { useBriefBankStore } from '@/store';
import PitchCTA from '@/components/PitchCTA.vue';

export default {
  name: 'Confirmation',
  components: { PitchCTA },
  computed: {
    ...mapState(useBriefBankStore, ['submitted', 'briefById']),
  },
  methods: {
    titleById(id) {
      const brief = this.briefById(id);
      return brief ? brief.title : id;
    },
    formatDate(iso) {
      return new Date(iso).toLocaleString('en-GB', {
        dateStyle: 'long',
        timeStyle: 'short',
      });
    },
  },
};
</script>
