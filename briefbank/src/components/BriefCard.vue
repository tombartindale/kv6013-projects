<template lang="pug">
q-card.full-height(flat, bordered, square)
  .column.full-height
    q-card-section.col-auto
      .row.items-center.justify-between.q-mb-xs(v-if="inShortlist")
        q-chip(dense, color="positive", text-color="white", icon="check_circle") On your shortlist
      .text-h5.text-bold.text-uppercase {{ brief.title }}

    q-separator

    q-card-section.col-auto
      .row.items-center.q-col-gutter-md.no-wrap
        .col-auto
          .id-circle {{ brief.id.replace(/^P/, '') }}
        .col
          .text-body1 To submit your preferences, use this ID on the preference form.

    q-separator

    q-card-section.col
      .brief-excerpt-wrap(style="position: relative")
        .brief-excerpt.text-body1.text-grey-8 {{ brief.generic_brief }}
        .fade-overlay

    q-separator

    q-card-section.col-auto(v-if="brief.methods_it_might_involve?.length || brief.technologies_it_might_use?.length")
      .text-overline.text-grey-7 Tags
      .row.q-gutter-xs.q-mt-xs
        q-chip(
          v-for="tag of brief.methods_it_might_involve"
          :key="'m-' + tag"
          clickable
          outline
          :selected="activeMethodTags.includes(tag)"
          @click="$emit('toggle-method', tag)"
        ) {{ tag }}
        q-chip(
          v-for="tag of brief.technologies_it_might_use"
          :key="'t-' + tag"
          clickable
          outline
          :selected="activeTechTags.includes(tag)"
          @click="$emit('toggle-tech', tag)"
        ) {{ tag }}

    q-separator

    q-card-section.col-auto
      project-type-meter(:value="brief.project_type_1to5")

    q-separator

    q-btn(
      flat,
      size="md",
      color="black",
      no-caps,
      class="full-width",
      :to="`/area/${areaSlug}/brief/${brief.id}`",
      :aria-label="`Read full brief for ${brief.title}`"
    ) Read more

</template>

<script>
import ProjectTypeMeter from './ProjectTypeMeter.vue';

export default {
  name: 'BriefCard',
  components: { ProjectTypeMeter },
  props: {
    brief: { type: Object, required: true },
    areaSlug: { type: String, required: true },
    activeMethodTags: { type: Array, default: () => [] },
    activeTechTags: { type: Array, default: () => [] },
    inShortlist: { type: Boolean, default: false },
  },
  emits: ['add', 'toggle-method', 'toggle-tech'],
};
</script>

<style scoped>
.id-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #21ba45;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  flex-shrink: 0;
}
.brief-excerpt-wrap {
  height: 150px;
  overflow: hidden;
  margin-bottom: 8px;
}
.brief-excerpt {
  line-height: 1.6;
}
.fade-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
}
</style>
