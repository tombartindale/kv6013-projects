<template lang="pug">
q-card.full-height(flat, bordered)
  .column.full-height
    q-card-section.col-auto
      .row.items-start.justify-between.q-col-gutter-xs
        .col-auto
          q-chip(dense, color="black", text-color="white", size="sm") {{ brief.id }}
        .col-auto(v-if="brief.specialism_tag")
          q-chip(dense, outline, size="sm") {{ brief.specialism_tag }}
      .text-subtitle1.text-bold.q-mt-sm {{ brief.title }}

    q-separator

    q-card-section.col
      .brief-excerpt.text-body2.text-grey-8.q-mb-sm {{ brief.generic_brief }}
      q-btn(
        flat,
        dense,
        size="sm",
        color="grey-8",
        no-caps,
        :to="`/area/${areaSlug}/brief/${brief.id}`",
        :aria-label="`Read full brief for ${brief.title}`"
      ) Read more

    q-separator

    q-card-section.col-auto
      project-type-meter(:value="brief.project_type_1to5", :compact="true")

    q-separator

    q-card-section.col-auto
      q-btn(
        v-if="isInShortlist",
        flat,
        color="positive",
        size="sm",
        icon="check",
        label="In shortlist",
        @click="removeFromShortlist(brief.id)",
        no-caps,
        :aria-label="`Remove ${brief.title} from shortlist`"
      )
      q-btn(
        v-else-if="!shortlistFull",
        unelevated,
        color="black",
        size="sm",
        icon="add",
        label="Add to shortlist",
        @click="$emit('add', brief)",
        no-caps,
        :aria-label="`Add ${brief.title} to shortlist`"
      )
      .text-caption.text-grey-5(v-else) Shortlist full
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useBriefBankStore } from '@/store';
import ProjectTypeMeter from './ProjectTypeMeter.vue';

export default {
  name: 'BriefCard',
  components: { ProjectTypeMeter },
  props: {
    brief: { type: Object, required: true },
    areaSlug: { type: String, required: true },
  },
  emits: ['add'],
  computed: {
    ...mapState(useBriefBankStore, ['shortlistFull', 'isInShortlist']),
    isInShortlist() {
      return useBriefBankStore().isInShortlist(this.brief.id);
    },
  },
  methods: {
    ...mapActions(useBriefBankStore, ['removeFromShortlist']),
  },
};
</script>

<style scoped>
.brief-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}
</style>
