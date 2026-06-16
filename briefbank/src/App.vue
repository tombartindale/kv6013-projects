<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-black.text-white
    q-toolbar
      q-btn(
        v-if="isHome",
        flat,
        round,
        icon="home",
        :to="'/'",
        aria-label="Home — KV6013 Brief Bank"
      )
      q-btn(
        v-else,
        flat,
        round,
        icon="arrow_back",
        @click="$router.back()",
        aria-label="Go back"
      )
      q-toolbar-title
        span.text-bold KV6013
        span.text-weight-light  Brief Bank
      q-btn(
        flat,
        no-caps,
        aria-label="Pitch your own project",
        @click="store.pitchDialogOpen = true"
      )
        q-icon(name="lightbulb")
        span.q-ml-xs.gt-xs Pitch your project
      q-btn.q-ml-sm(
        flat,
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
      img.nu-logo(src="@/assets/NU_Logo_White.svg", alt="Northumbria University")
    .row.justify-center.items-center.q-py-sm.bg-grey-9(v-if="daysLeft > 0")
      q-icon.q-mr-sm(
        :name="daysLeft <= 7 ? 'warning' : 'schedule'",
        :color="daysLeft <= 7 ? 'amber' : 'grey-4'"
      )
      .text-h6(:class="daysLeft <= 7 ? 'text-amber' : 'text-grey-4'")
        | {{ daysLeft }} days to submit your preferences
  q-page-container
    router-view

  q-dialog(v-model="store.pitchDialogOpen")
    q-card(style="width: 100%; max-width: 720px")
      q-card-section.bg-black.text-white
        .text-h6
          q-icon.q-mr-sm(name="lightbulb")
          | Pitching your own project
      q-card-section.q-pt-lg
        .text-body2.text-grey-8.q-mb-lg
          | You can propose your own project idea instead of choosing from the brief bank.
          | To do this, you need to find a member of staff willing to supervise it.
          | Here's how the process works:

        .flow
          .flow-step
            .flow-icon
              q-icon(name="psychology", size="28px", color="white")
            .flow-body
              .text-subtitle2.text-bold Have an idea?
              .text-body2.text-grey-8 Your project must be relevant to the module themes — ethics, responsibility, and computing in society.

          .flow-arrow
            q-icon(name="arrow_downward", color="grey-5", size="20px")

          .flow-step
            .flow-icon
              q-icon(name="group", size="28px", color="white")
            .flow-body
              .text-subtitle2.text-bold Find a supervisor
              .text-body2.text-grey-8 Reach out to a member of academic staff. Explain your idea briefly and ask if they'd be willing to supervise it.

          .flow-arrow
            q-icon(name="arrow_downward", color="grey-5", size="20px")

          .flow-step
            .flow-icon
              q-icon(name="check_circle", size="28px", color="white")
            .flow-body
              .text-subtitle2.text-bold Get agreement
              .text-body2.text-grey-8 Once a supervisor agrees in principle, ask them to complete the supervisor nomination form to officially register their commitment.

          .flow-arrow
            q-icon(name="arrow_downward", color="grey-5", size="20px")

          .flow-step
            .flow-icon
              q-icon(name="edit_note", size="28px", color="white")
            .flow-body
              .text-subtitle2.text-bold Supervisor submits the form
              .text-body2.text-grey-8 Your supervisor fills in and submits the nomination form. Your pitch is only confirmed once the module team receives it.

        q-banner.q-mt-lg(rounded, dense)
          template(v-slot:avatar)
            q-icon(name="info", color="blue-7")
          .text-body2 Not sure who to approach? Look at staff research profiles on the Northumbria website to find someone whose interests match your idea.

      q-card-actions(align="right")
        q-btn(flat, label="Close", color="grey-8", v-close-popup)
</template>

<script>
import { mapState } from 'pinia';
import { useBriefBankStore } from '@/store';
import { PREFERENCES_DEADLINE } from '@/config';

export default {
  name: 'App',
  setup() {
    return { store: useBriefBankStore() };
  },
  computed: {
    ...mapState(useBriefBankStore, {
      shortlistCount: (state) => state.shortlist.length,
    }),
    isHome() {
      return this.$route.name === 'home';
    },
    daysLeft() {
      const deadline = new Date(PREFERENCES_DEADLINE);
      const now = new Date();
      return Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    },
  },
  created() {
    useBriefBankStore().loadBank();
  },
};
</script>

<style scoped>
.nu-logo {
  height: 48px;
  margin-left: 16px;
  flex-shrink: 0;
}
.flow {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}
.flow-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.flow-body {
  padding-top: 8px;
}
.flow-arrow {
  padding: 0;
  align-self: flex-start;
  margin-top: 14px;
  transform: rotate(-90deg);
}

@media (max-width: 599px) {
  .flow {
    flex-direction: column;
  }
  .flow-step {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
    flex: unset;
    width: 100%;
    gap: 14px;
  }
  .flow-body {
    padding-top: 4px;
  }
  .flow-arrow {
    padding: 0;
    margin-left: 14px;
    margin-top: 0;
    transform: rotate(0deg);
  }
}
</style>
