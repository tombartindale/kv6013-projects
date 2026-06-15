<template lang="pug">
q-page.q-pa-md
  .row.items-center.q-mb-md
    .col
      q-btn(flat, dense, icon="arrow_back", :to="'/'", no-caps) All areas
    .col-auto
      q-btn(
        flat,
        dense,
        :to="'/shortlist'",
        no-caps,
        :aria-label="`Shortlist — ${shortlistCount} selected`"
      )
        q-icon(name="playlist_add_check")
        q-badge(v-if="shortlistCount > 0", floating, color="amber", text-color="black") {{ shortlistCount }}
        span.q-ml-xs Shortlist

  .text-h5.text-bold.q-mb-xs {{ areaName }}
  .text-body2.text-grey-7.q-mb-lg(v-if="descriptions[areaName]") {{ descriptions[areaName] }}

  .row.q-col-gutter-md.q-mb-sm
    .col-12.col-sm-6
      q-input(
        v-model="search",
        dense,
        outlined,
        clearable,
        placeholder="Search briefs…",
        aria-label="Search briefs by title, description, or tag"
      )
        template(v-slot:prepend)
          q-icon(name="search")
    .col-12.col-sm-6
      q-select(
        v-model="typeFilter",
        dense,
        outlined,
        clearable,
        label="Project type",
        :options="typeOptions",
        emit-value,
        map-options,
        aria-label="Filter by project type"
      )

  .row.items-center.q-col-gutter-sm.q-mb-md(v-if="specialismTags.length")
    .col-auto
      .text-overline.text-grey-7 Specialism
    .col-auto(v-for="tag of specialismTags" :key="tag")
      q-chip(
        clickable,
        dense,
        :selected="selectedTags[tag]",
        @update:selected="(v) => setTag(tag, v)",
        :aria-pressed="!!selectedTags[tag]"
      ) {{ tag }}

  .text-body2.text-grey-6.q-mb-md Showing {{ filtered.length }} of {{ briefs.length }} briefs

  .row.q-col-gutter-md
    .col-12.col-sm-6.col-md-4(v-for="brief of filtered" :key="brief.id")
      brief-card(
        :brief="brief",
        :area-slug="$route.params.slug",
        @add="handleAdd"
      )

  .row.justify-center.q-mt-lg(v-if="filtered.length === 0 && briefs.length > 0")
    .col-auto.text-center
      q-icon(name="search_off", size="3rem", color="grey-4")
      .text-grey-6.q-mt-sm No briefs match — try clearing the search or filters.

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
import { AREA_SLUGS, AREA_DESCRIPTIONS } from '@/config';
import BriefCard from '@/components/BriefCard.vue';
import PitchCTA from '@/components/PitchCTA.vue';

export default {
  name: 'AreaBrowse',
  components: { BriefCard, PitchCTA },
  data() {
    return {
      search: '',
      typeFilter: null,
      selectedTags: {},
      switchDialog: false,
      pendingBrief: null,
    };
  },
  computed: {
    ...mapState(useBriefBankStore, ['shortlistArea', 'briefsByArea']),
    ...mapState(useBriefBankStore, {
      shortlistCount: (state) => state.shortlist.length,
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
    specialismTags() {
      return [...new Set(this.briefs.map((b) => b.specialism_tag).filter(Boolean))].sort();
    },
    typeOptions() {
      return [
        { label: 'Investigation (1–2)', value: 'investigation' },
        { label: 'Balanced (3)', value: 'balanced' },
        { label: 'Build (4–5)', value: 'build' },
      ];
    },
    filtered() {
      let result = this.briefs;
      if (this.search) {
        const q = this.search.toLowerCase();
        result = result.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            (b.generic_brief || '').toLowerCase().includes(q) ||
            (b.specialism_tag || '').toLowerCase().includes(q)
        );
      }
      if (this.typeFilter) {
        result = result.filter((b) => {
          if (this.typeFilter === 'investigation') return b.project_type_1to5 <= 2;
          if (this.typeFilter === 'balanced') return b.project_type_1to5 === 3;
          if (this.typeFilter === 'build') return b.project_type_1to5 >= 4;
          return true;
        });
      }
      const activeTags = Object.keys(this.selectedTags).filter((t) => this.selectedTags[t]);
      if (activeTags.length) {
        result = result.filter((b) => activeTags.includes(b.specialism_tag));
      }
      return result;
    },
  },
  watch: {
    briefs: {
      immediate: true,
      handler(briefs) {
        const tags = {};
        briefs.forEach((b) => {
          if (b.specialism_tag) tags[b.specialism_tag] = false;
        });
        this.selectedTags = tags;
      },
    },
  },
  methods: {
    ...mapActions(useBriefBankStore, ['addToShortlist', 'switchAreaAndAdd']),
    setTag(tag, val) {
      this.selectedTags[tag] = val;
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
