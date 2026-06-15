<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-black.text-white
    q-toolbar
      q-btn(flat, dense, round, icon="home", :to="'/'", aria-label="Home — KV6013 Brief Bank")
      q-toolbar-title
        span.text-bold KV6013
        span.text-weight-light  Brief Bank
      q-btn(
        flat,
        dense,
        :href="pitchUrl",
        target="_blank",
        rel="noopener noreferrer",
        size="sm",
        no-caps,
        aria-label="Pitch your own project — opens external form"
      )
        q-icon(name="lightbulb", size="xs")
        span.q-ml-xs.gt-xs Pitch your project
      q-btn.q-ml-sm(
        flat,
        dense,
        :to="'/shortlist'",
        no-caps,
        :aria-label="`Shortlist — ${shortlistCount} brief${shortlistCount !== 1 ? 's' : ''} selected`"
      )
        q-icon(name="playlist_add_check")
        q-badge(
          v-if="shortlistCount > 0",
          floating,
          color="amber",
          text-color="black",
          :label="String(shortlistCount)"
        )
        span.q-ml-xs.gt-xs Shortlist
  q-page-container
    router-view
</template>

<script>
import { mapState } from 'pinia';
import { useBriefBankStore } from '@/store';
import { PITCH_FORM_URL } from '@/config';

export default {
  name: 'App',
  computed: {
    ...mapState(useBriefBankStore, {
      shortlistCount: (state) => state.shortlist.length,
    }),
    pitchUrl() {
      return PITCH_FORM_URL;
    },
  },
  created() {
    useBriefBankStore().loadBank();
  },
};
</script>
