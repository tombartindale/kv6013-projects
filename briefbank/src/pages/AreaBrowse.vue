<template lang="pug">
q-page.q-pa-md
  .row.justify-center.q-mb-xs
    .col-12.col-md-10.col-lg-8.text-center
      .text-h5.text-bold {{ areaName }}
      .text-body2.text-grey-7.q-mt-xs(v-if="descriptions[areaName]") {{ descriptions[areaName] }}

  .row.justify-center.q-mb-sm(v-if="allFamilies.length")
    .col-12.col-md-10.col-lg-8
      .row.justify-center.items-center.q-gutter-sm
        .text-body2.text-grey-7 Specialism
        q-chip(
          v-for="fam of allFamilies"
          :key="fam"
          clickable
          :selected="selectedFamily === fam"
          @click="selectedFamily = selectedFamily === fam ? null : fam"
        ) {{ fam }}

  .row.justify-center.q-mb-sm(v-if="filterableMethodTags.length")
    .col-12.col-md-10.col-lg-8
      .row.justify-center.items-center.q-gutter-sm
        .text-body2.text-grey-7 Methods
        q-chip(
          v-for="tag of filterableMethodTags"
          :key="tag"
          clickable
          :selected="selectedMethods[tag]"
          @click="toggleMethod(tag)"
        ) {{ tag }}

  .row.justify-center.q-mb-lg(v-if="filterableTechTags.length")
    .col-12.col-md-10.col-lg-8
      .row.justify-center.items-center.q-gutter-sm
        .text-body2.text-grey-7 Technologies
        q-chip(
          v-for="tag of filterableTechTags"
          :key="tag"
          clickable
          color="blue-grey-1"
          :selected="selectedTech[tag]"
          @click="toggleTech(tag)"
        ) {{ tag }}

  .text-body2.text-grey-6.q-mb-md.text-center Showing {{ filtered.length }} of {{ briefs.length }} briefs

  .row.q-col-gutter-md
    .col-12.col-sm-6.col-md-4(v-for="brief of filtered" :key="brief.id")
      brief-card(
        :brief="brief",
        :area-slug="slugForBrief(brief)",
        :active-method-tags="activeMethodTagsArr",
        :active-tech-tags="activeTechTagsArr",
        :in-shortlist="shortlistIds.includes(brief.id)",
        @add="handleAdd",
        @toggle-method="toggleMethod",
        @toggle-tech="toggleTech"
      )

  .row.justify-center.q-mt-lg(v-if="filtered.length === 0 && briefs.length > 0")
    .col-auto.text-center
      q-icon(name="search_off", size="3rem", color="grey-4")
      .text-grey-6.q-mt-sm No briefs match — try clearing the filters.

  .q-mt-xl
    pitch-c-t-a

  q-dialog(v-model="switchDialog")
    q-card(style="min-width: 320px")
      q-card-section
        .text-h6 Switch area?
      q-card-section.q-pt-none
        .text-body2
          | Your current shortlist is for
          strong  {{ shortlistArea }}.
          |  Adding this brief will clear it and switch to
          strong  {{ pendingBrief && pendingBrief.area }}.
      q-card-actions(align="right")
        q-btn(flat, label="Cancel", @click="switchDialog = false")
        q-btn(flat, color="negative", label="Switch and clear", @click="confirmSwitch")
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useBriefBankStore } from '@/store';
import { AREA_SLUGS, AREA_DESCRIPTIONS, SLUG_BY_AREA } from '@/config';
import BriefCard from '@/components/BriefCard.vue';
import PitchCTA from '@/components/PitchCTA.vue';

const METHOD_EXCLUDE = new Set(['Model evaluation']);
const TECH_EXCLUDE = new Set(['Python']);

export default {
  name: 'AreaBrowse',
  components: { BriefCard, PitchCTA },
  data() {
    return {
      selectedFamily: null,
      selectedMethods: {},
      selectedTech: {},
      switchDialog: false,
      pendingBrief: null,
    };
  },
  computed: {
    ...mapState(useBriefBankStore, ['shortlistArea', 'briefsByArea', 'allBriefs']),
    ...mapState(useBriefBankStore, {
      shortlistCount: (state) => state.shortlist.length,
      shortlistIds: (state) => state.shortlist,
    }),
    areaName() {
      return AREA_SLUGS[this.$route.params.slug] || '';
    },
    briefs() {
      return this.briefsByArea(this.areaName);
    },
    descriptions() {
      return AREA_DESCRIPTIONS;
    },
    allFamilies() {
      return [...new Set(this.allBriefs.map((b) => b.specialism_family).filter(Boolean))].sort();
    },
    filterableMethodTags() {
      return [...new Set(this.briefs.flatMap((b) => b.methods_it_might_involve || []))]
        .filter((t) => !METHOD_EXCLUDE.has(t))
        .sort();
    },
    filterableTechTags() {
      return [...new Set(this.briefs.flatMap((b) => b.technologies_it_might_use || []))]
        .filter((t) => !TECH_EXCLUDE.has(t))
        .sort();
    },
    activeMethodTagsArr() {
      return Object.keys(this.selectedMethods).filter((t) => this.selectedMethods[t]);
    },
    activeTechTagsArr() {
      return Object.keys(this.selectedTech).filter((t) => this.selectedTech[t]);
    },
    filtered() {
      // Specialism family filter is cross-area: start from all briefs when active
      let result = this.selectedFamily ? this.allBriefs : this.briefs;

      if (this.selectedFamily) {
        result = result.filter((b) => b.specialism_family === this.selectedFamily);
      }
      if (this.activeMethodTagsArr.length) {
        result = result.filter((b) =>
          this.activeMethodTagsArr.some((t) => (b.methods_it_might_involve || []).includes(t))
        );
      }
      if (this.activeTechTagsArr.length) {
        result = result.filter((b) =>
          this.activeTechTagsArr.some((t) => (b.technologies_it_might_use || []).includes(t))
        );
      }
      return result;
    },
  },
  watch: {
    briefs: {
      immediate: true,
      handler(briefs) {
        const methods = {};
        briefs.forEach((b) =>
          (b.methods_it_might_involve || []).forEach((t) => { methods[t] = false; })
        );
        this.selectedMethods = methods;

        const tech = {};
        briefs.forEach((b) =>
          (b.technologies_it_might_use || []).forEach((t) => { tech[t] = false; })
        );
        this.selectedTech = tech;
      },
    },
  },
  methods: {
    ...mapActions(useBriefBankStore, ['addToShortlist', 'switchAreaAndAdd']),
    slugForBrief(brief) {
      return SLUG_BY_AREA[brief.area] || this.$route.params.slug;
    },
    toggleMethod(tag) {
      this.selectedMethods[tag] = !this.selectedMethods[tag];
    },
    toggleTech(tag) {
      this.selectedTech[tag] = !this.selectedTech[tag];
    },
    handleAdd(brief) {
      if (this.shortlistArea && this.shortlistArea !== brief.area) {
        this.pendingBrief = brief;
        this.switchDialog = true;
        return;
      }
      this.addToShortlist(brief.id);
    },
    confirmSwitch() {
      if (!this.pendingBrief) return;
      this.switchAreaAndAdd(this.pendingBrief.id, this.pendingBrief.area);
      this.switchDialog = false;
      this.pendingBrief = null;
    },
  },
};
</script>
