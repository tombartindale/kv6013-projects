<template lang="pug">
q-banner.q-mt-md(
  :class="compact ? 'bg-grey-1' : 'bg-grey-2'",
  :dense="compact",
  rounded
)
  template(v-slot:avatar)
    q-icon(name="lightbulb", :color="compact ? 'grey-5' : 'grey-7'")
  span(v-if="!compact") Already have your own idea and a supervisor who'll take it on? That takes priority over this process — submit it here.
  span(v-else) Have your own idea and a supervisor?
  template(v-slot:action)
    q-btn(
      :flat="compact",
      :unelevated="!compact",
      :color="compact ? 'grey-8' : 'black'",
      :label="compact ? 'Pitch your project' : 'Pitch your own project'",
      :size="compact ? 'sm' : 'md'",
      no-caps,
      aria-label="Pitch your own project",
      @click="store.pitchDialogOpen = true"
    )
</template>

<script>
import { useBriefBankStore } from '@/store';

export default {
  name: 'PitchCTA',
  props: {
    compact: { type: Boolean, default: false },
  },
  setup() {
    return { store: useBriefBankStore() };
  },
};
</script>
