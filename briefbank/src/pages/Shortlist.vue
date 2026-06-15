<template lang="pug">
q-page.q-pa-md
  .row.items-center.q-mb-lg
    .col
      q-btn(flat, dense, icon="arrow_back", @click="goBack", no-caps) Back
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

  .text-h5.text-bold.q-mb-xs My shortlist
  .text-body2.text-grey-7.q-mb-lg(v-if="shortlistArea") Area: {{ shortlistArea }}

  .row.justify-center(v-if="shortlistBriefs.length === 0")
    .col-12.col-md-8.text-center.q-mt-xl
      q-icon(name="playlist_add", size="4rem", color="grey-4")
      .text-h6.text-grey-5.q-mt-md No briefs in your shortlist yet
      q-btn.q-mt-lg(unelevated, color="black", :to="'/'", label="Browse areas")

  .row.justify-center(v-else)
    .col-12.col-md-8
      .text-caption.text-grey-7.q-mb-md Use the arrows to set your preference order. Rank 1 is your first choice.

      draggable(
        v-model="localBriefs",
        item-key="id",
        handle=".drag-handle",
        ghost-class="drag-ghost",
        @end="onDragEnd"
      )
        template(v-slot:item="{ element: brief, index: idx }")
          .q-mb-sm
            q-card(flat, bordered)
              q-card-section(horizontal)
                .col-auto.flex.flex-center.q-px-sm.drag-handle(
                  title="Drag to reorder",
                  aria-hidden="true",
                  style="cursor: grab; color: #bbb"
                )
                  q-icon(name="drag_indicator")
                q-separator(vertical)
                .col-auto.flex.flex-center.q-px-md.bg-black.text-white(
                  style="min-width: 44px",
                  :aria-label="`Rank ${idx + 1}`"
                )
                  .text-h6.text-bold {{ idx + 1 }}
                q-separator(vertical)
                .col.q-pa-sm
                  .text-subtitle2.text-bold {{ brief.title }}
                  .text-caption.text-grey-7 {{ brief.id }}
                    span(v-if="brief.specialism_tag")  · {{ brief.specialism_tag }}
                  project-type-meter(:value="brief.project_type_1to5", :compact="true")
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

      .text-caption.text-grey-6.q-mt-sm(v-if="shortlistBriefs.length < 4")
        | You can add up to {{ 4 - shortlistBriefs.length }} more brief{{ (4 - shortlistBriefs.length) !== 1 ? 's' : '' }}.
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
            autocomplete="off"
          )
        .col-12.col-sm-6
          q-input(
            v-model="studentProgramme",
            dense,
            outlined,
            label="Programme",
            placeholder="e.g. BSc Computer Science",
            aria-label="Programme"
          )

      q-banner.q-mt-md.bg-blue-1(v-if="!canSubmit", rounded)
        template(v-slot:avatar)
          q-icon(name="info", color="primary")
        | Add at least one brief before submitting.

      q-banner.q-mt-md.bg-warning(v-else-if="!studentId.trim()", rounded)
        template(v-slot:avatar)
          q-icon(name="warning")
        | Enter your student ID before submitting.

      .row.justify-end.q-mt-lg
        q-btn(
          unelevated,
          size="lg",
          color="black",
          label="Submit ranking",
          icon-right="send",
          :disable="!canSubmit || !studentId.trim()",
          @click="submit",
          aria-label="Submit your ranked shortlist"
        )

  .q-mt-xl
    pitch-c-t-a
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useBriefBankStore } from '@/store';
import draggable from 'vuedraggable';
import ProjectTypeMeter from '@/components/ProjectTypeMeter.vue';
import PitchCTA from '@/components/PitchCTA.vue';
import { SLUG_BY_AREA, SUBMISSION_ENDPOINT } from '@/config';

export default {
  name: 'ShortlistPage',
  components: { draggable, ProjectTypeMeter, PitchCTA },
  data() {
    return { localBriefs: [] };
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
    studentProgramme: {
      get() {
        return useBriefBankStore().student.programme;
      },
      set(val) {
        useBriefBankStore().setStudent({ programme: val });
      },
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
    onDragEnd() {
      this.reorderShortlist(this.localBriefs.map((b) => b.id));
    },
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
    goBack() {
      this.$router.push(
        this.areaSlug ? { name: 'area', params: { slug: this.areaSlug } } : { name: 'home' }
      );
    },
    async submit() {
      const payload = this.submitRanking();
      if (SUBMISSION_ENDPOINT) {
        try {
          await fetch(SUBMISSION_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (e) {
          console.error('Submission POST failed:', e);
        }
      }
      this.$router.push({ name: 'confirm' });
    },
  },
};
</script>

<style scoped>
.drag-handle:active {
  cursor: grabbing;
}
.drag-ghost {
  opacity: 0.4;
}
</style>
