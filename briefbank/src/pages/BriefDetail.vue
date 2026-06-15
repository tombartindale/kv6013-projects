<template lang="pug">
q-page.q-pa-md(v-if="brief")
  .row.q-mb-md
    .col
      q-btn(flat, dense, icon="arrow_back", @click="$router.back()", no-caps) Back

  .row.justify-center
    .col-12.col-md-8
      .text-overline.text-grey-7 {{ brief.area }}
      .text-h5.text-bold.q-mb-sm {{ brief.title }}

      .row.items-center.q-col-gutter-sm.q-mb-md
        .col-auto
          q-chip(dense, color="black", text-color="white") {{ brief.id }}
        .col-auto(v-if="brief.specialism_tag")
          q-chip(dense, outline) {{ brief.specialism_tag }}

      project-type-meter(:value="brief.project_type_1to5")

      q-separator.q-my-lg

      .text-overline.text-grey-7.q-mb-sm Project brief
      .text-body1(style="white-space: pre-wrap; line-height: 1.7") {{ brief.generic_brief }}

      q-banner.q-mt-md.bg-grey-2(rounded)
        template(v-slot:avatar)
          q-icon(name="info", color="grey-6")
        .text-caption These are flexible starting points — you'll refine the specifics with your supervisor.

      q-separator.q-my-lg

      .text-overline.text-grey-7.q-mb-sm Worked examples
      .q-mb-sm(v-for="(ex, i) of brief.worked_examples" :key="i")
        .row.no-wrap
          q-icon.q-mt-xs(name="chevron_right", size="xs", color="grey-6")
          .text-body2.q-ml-xs {{ ex }}

      q-separator.q-my-lg

      .row.q-col-gutter-lg
        .col-12.col-sm-6(v-if="brief.methods_it_might_involve")
          .text-overline.text-grey-7.q-mb-sm Methods it might involve
          .text-body2 {{ brief.methods_it_might_involve }}
        .col-12.col-sm-6(v-if="brief.technologies_it_might_use")
          .text-overline.text-grey-7.q-mb-sm Technologies it might use
          .text-body2 {{ brief.technologies_it_might_use }}

      q-separator.q-my-lg

      .text-overline.text-grey-7.q-mb-sm Eligible programmes
      .text-body2 {{ brief.programmes }}

      q-separator.q-my-lg

      div(v-if="isInShortlist")
        q-banner.bg-positive.text-white(rounded)
          template(v-slot:avatar)
            q-icon(name="check_circle")
          | In your shortlist — rank {{ rank }}
          template(v-slot:action)
            q-btn(flat, color="white", label="Remove", @click="removeFromShortlist(brief.id)", aria-label="Remove from shortlist")

      div(v-else-if="!shortlistFull")
        q-btn(
          unelevated,
          color="black",
          icon="add",
          label="Add to shortlist",
          @click="add",
          :aria-label="`Add ${brief.title} to shortlist`"
        )
        .text-caption.q-mt-sm.text-grey-7(v-if="shortlistCount > 0")
          | {{ 4 - shortlistCount }} slot{{ (4 - shortlistCount) !== 1 ? 's' : '' }} remaining

      div(v-else)
        q-banner.bg-warning.text-dark(rounded)
          template(v-slot:avatar)
            q-icon(name="warning")
          | Shortlist full (max 4). Remove a brief from your
          q-btn.q-ml-xs(flat, dense, no-caps, size="sm", :to="'/shortlist'") shortlist
          |  to add this one.

      .q-mt-xl
        pitch-c-t-a

  q-dialog(v-model="switchDialog")
    q-card(style="min-width: 320px")
      q-card-section
        .text-h6 Switch area?
      q-card-section.q-pt-none
        .text-body2
          | Your shortlist is for
          strong  {{ shortlistArea }}.
          |  Adding this will clear it and switch to
          strong  {{ brief && brief.area }}.
      q-card-actions(align="right")
        q-btn(flat, label="Cancel", @click="switchDialog = false")
        q-btn(flat, color="negative", label="Switch and clear", @click="confirmSwitch")

q-page.q-pa-md.flex.flex-center(v-else-if="bankLoaded")
  .text-center
    q-icon(name="search_off", size="4rem", color="grey-4")
    .text-h6.text-grey-5.q-mt-md Brief not found
    q-btn.q-mt-md(unelevated, color="black", :to="'/'", label="Back to areas")

q-page.q-pa-md.flex.flex-center(v-else)
  q-spinner(size="3em", color="black")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'pinia';
import { useBriefBankStore } from '@/store';
import ProjectTypeMeter from '@/components/ProjectTypeMeter.vue';
import PitchCTA from '@/components/PitchCTA.vue';

export default {
  name: 'BriefDetail',
  components: { ProjectTypeMeter, PitchCTA },
  data() {
    return { switchDialog: false };
  },
  computed: {
    ...mapState(useBriefBankStore, [
      'shortlistArea',
      'shortlistFull',
      'isInShortlist',
      'briefById',
    ]),
    ...mapState(useBriefBankStore, {
      bankLoaded: (state) => !!state.bank,
      shortlistCount: (state) => state.shortlist.length,
    }),
    brief() {
      return this.briefById(this.$route.params.id);
    },
    isInShortlist() {
      return useBriefBankStore().isInShortlist(this.$route.params.id);
    },
    rank() {
      const ids = useBriefBankStore().shortlist;
      const idx = ids.indexOf(this.$route.params.id);
      return idx >= 0 ? idx + 1 : null;
    },
  },
  methods: {
    ...mapActions(useBriefBankStore, [
      'addToShortlist',
      'removeFromShortlist',
      'switchAreaAndAdd',
    ]),
    add() {
      if (this.shortlistArea && this.shortlistArea !== this.brief.area) {
        this.switchDialog = true;
        return;
      }
      this.addToShortlist(this.brief.id);
    },
    confirmSwitch() {
      this.switchAreaAndAdd(this.brief.id, this.brief.area);
      this.switchDialog = false;
    },
  },
};
</script>
