<template lang="pug">
q-page.q-pa-md
  .row.items-center.q-mb-lg
    .col
    .col-auto(v-if="shortlistBriefs.length")
      q-btn(
        flat,
        dense,
        color="negative",
        icon="delete_sweep",
        label="Clear all",
        @click="clearShortlist",
        no-caps,
        aria-label="Clear all briefs from shortlist"
      )

  .row.justify-center(v-if="shortlistBriefs.length === 0")
    .col-12.col-md-8
      .text-h5.text-bold.q-mb-xs My shortlist
      .text-body2.text-grey-7.q-mb-lg(v-if="shortlistArea") Area: {{ shortlistArea }}
      .text-center.q-mt-xl
        q-icon(name="playlist_add", size="4rem", color="grey-4")
        .text-h6.text-grey-5.q-mt-md No briefs in your shortlist yet
        q-btn.q-mt-lg(unelevated, color="black", :to="'/'", label="Browse areas")

  .row.justify-center(v-else)
    .col-12.col-md-8
      .text-h5.text-bold.q-mb-xs My shortlist
      .text-body2.text-grey-7.q-mb-lg(v-if="shortlistArea") Area: {{ shortlistArea }}
      .text-caption.text-grey-7.q-mb-md Use the arrows to set your preference order. Rank 1 is your top choice.

      div
        .q-mb-sm(v-for="(brief, idx) in localBriefs", :key="brief.id")
          q-card(flat, bordered)
            q-card-section(horizontal)
              .col-auto.flex.flex-center.q-px-md.bg-black.text-white(
                style="min-width: 44px",
                :aria-label="`Rank ${idx + 1}`"
              )
                .text-h6.text-bold {{ idx + 1 }}
              q-separator(vertical)
              .col.q-pa-sm
                .row.items-center.q-col-gutter-sm.no-wrap.q-mb-xs
                  .col-auto
                    .id-circle {{ brief.id.replace(/^P/, '') }}
                  .col
                    .text-h5.text-bold.text-uppercase {{ brief.title }}
                .text-caption.text-grey-7(v-if="brief.specialism_tag") {{ brief.specialism_tag }}
              q-separator(vertical)
              .col-auto.column.justify-center.q-pa-xs
                q-btn(
                  flat,
                  dense,
                  round,
                  icon="keyboard_arrow_up",
                  :disable="idx === 0",
                  @click="moveUp(idx)",
                  :aria-label="`Move ${brief.title} up`"
                )
                q-btn(
                  flat,
                  dense,
                  round,
                  icon="keyboard_arrow_down",
                  :disable="idx === localBriefs.length - 1",
                  @click="moveDown(idx)",
                  :aria-label="`Move ${brief.title} down`"
                )
                q-btn(
                  flat,
                  dense,
                  round,
                  icon="close",
                  color="negative",
                  @click="removeFromShortlist(brief.id)",
                  :aria-label="`Remove ${brief.title} from shortlist`"
                )

      .text-caption.text-grey-6.q-mt-sm(v-if="shortlistBriefs.length < 3")
        | You can add up to {{ 3 - shortlistBriefs.length }} more brief{{ (3 - shortlistBriefs.length) !== 1 ? 's' : '' }}.
        q-btn.q-ml-sm(flat, dense, no-caps, size="sm", :to="areaSlug ? `/area/${areaSlug}` : '/'") Add more

      q-separator.q-my-lg

      .text-subtitle1.text-bold.q-mb-md Your details

      .row.q-col-gutter-md
        .col-12.col-sm-6
          q-input(
            v-model="studentId",
            dense,
            outlined,
            label="Student ID (w-number)",
            placeholder="e.g. w12345678",
            aria-label="Student ID — required to submit",
            autocomplete="off",
            :rules="[idRule]",
            lazy-rules
          )
        .col-12.col-sm-6
          q-input(
            v-model="studentEmail",
            dense,
            outlined,
            label="University email address",
            placeholder="e.g. w12345678@northumbria.ac.uk",
            type="email",
            aria-label="University email address",
            :rules="[emailRule]",
            lazy-rules
          )

      q-banner.q-mt-md.bg-blue-1(v-if="!canSubmit", rounded)
        template(v-slot:avatar)
          q-icon(name="info", color="primary")
        | You need 3 preferences before you can submit — {{ 3 - shortlistBriefs.length }} more to go.

      q-banner.q-mt-md.bg-warning(v-else-if="!detailsValid", rounded)
        template(v-slot:avatar)
          q-icon(name="warning")
        | Fix the errors above before submitting.

      q-banner.q-mt-md.bg-negative.text-white(v-if="submitError", rounded)
        template(v-slot:avatar)
          q-icon(name="error", color="white")
        | {{ submitError }}. Check your student ID and email address are correct.

      .row.justify-end.q-mt-lg
        q-btn(
          unelevated,
          size="lg",
          color="black",
          label="Submit ranking",
          icon-right="send",
          :disable="!canSubmit || !detailsValid || submitting",
          :loading="submitting",
          @click="submit",
          aria-label="Submit your ranked shortlist"
        )

  .q-mt-xl
    pitch-c-t-a
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useBriefBankStore } from '@/store';
import PitchCTA from '@/components/PitchCTA.vue';
import { SLUG_BY_AREA, SUBMISSION_ENDPOINT } from '@/config';

export default {
  name: 'ShortlistPage',
  components: { PitchCTA },
  data() {
    return { localBriefs: [], submitError: null, submitting: false };
  },
  computed: {
    ...mapState(useBriefBankStore, ['shortlistBriefs', 'shortlistArea', 'canSubmit']),
    areaSlug() {
      return SLUG_BY_AREA[this.shortlistArea] || '';
    },
    studentId: {
      get() {
        return useBriefBankStore().student.id;
      },
      set(val) {
        useBriefBankStore().setStudent({ id: val });
      },
    },
    studentEmail: {
      get() {
        return useBriefBankStore().student.email;
      },
      set(val) {
        useBriefBankStore().setStudent({ email: val });
      },
    },
    detailsValid() {
      return (
        /^[a-z]+\d+$/i.test(this.studentId.trim()) &&
        /@northumbria\.ac\.uk$/i.test(this.studentEmail.trim())
      );
    },
  },
  watch: {
    shortlistBriefs: {
      immediate: true,
      handler(briefs) {
        const localIds = this.localBriefs.map((b) => b.id).join(',');
        const storeIds = briefs.map((b) => b.id).join(',');
        if (localIds !== storeIds) this.localBriefs = [...briefs];
      },
    },
  },
  methods: {
    ...mapActions(useBriefBankStore, [
      'removeFromShortlist',
      'reorderShortlist',
      'clearShortlist',
      'submitRanking',
    ]),
    moveUp(idx) {
      if (idx === 0) return;
      const briefs = [...this.localBriefs];
      [briefs[idx - 1], briefs[idx]] = [briefs[idx], briefs[idx - 1]];
      this.localBriefs = briefs;
      this.reorderShortlist(briefs.map((b) => b.id));
    },
    moveDown(idx) {
      const briefs = [...this.localBriefs];
      if (idx >= briefs.length - 1) return;
      [briefs[idx + 1], briefs[idx]] = [briefs[idx], briefs[idx + 1]];
      this.localBriefs = briefs;
      this.reorderShortlist(briefs.map((b) => b.id));
    },
    idRule(val) {
      return /^[a-z]+\d+$/i.test(val.trim()) || 'Must be a valid student or staff ID (e.g. w12345678)';
    },
    emailRule(val) {
      return /@northumbria\.ac\.uk$/i.test(val.trim()) || 'Must be your Northumbria email address';
    },
    goBack() {
      this.$router.push(
        this.areaSlug ? { name: 'area', params: { slug: this.areaSlug } } : { name: 'home' }
      );
    },
    async submit() {
      this.submitError = null;
      this.submitting = true;
      const payload = this.submitRanking();
      if (SUBMISSION_ENDPOINT) {
        try {
          const resp = await fetch(SUBMISSION_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!resp.ok) {
            const data = await resp.json().catch(() => ({}));
            this.submitError = data.error || 'Something went wrong. Please try again.';
            this.submitting = false;
            return;
          }
        } catch (e) {
          console.error('Submission POST failed:', e);
          this.submitting = false;
        }
      }
      this.$router.push({ name: 'confirm' });
    },
  },
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

</style>
