import { defineStore } from 'pinia';

const STORAGE_KEY = 'kv6013-briefbank';

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const useBriefBankStore = defineStore('briefbank', {
  state: () => {
    const p = loadPersisted();
    return {
      bank: null,
      bankError: null,
      shortlist: p.shortlist || [],
      shortlistArea: p.shortlistArea || '',
      student: p.student || { id: '', programme: '' },
      submitted: null,
    };
  },

  getters: {
    areas(state) {
      if (!state.bank) return [];
      const byArea = {};
      state.bank.briefs.forEach((b) => {
        if (!byArea[b.area]) byArea[b.area] = [];
        byArea[b.area].push(b);
      });
      return Object.keys(byArea).map((name) => {
        const briefs = byArea[name];
        const programmes = [
          ...new Set(briefs.map((b) => b.programmes).filter(Boolean)),
        ].join(', ');
        return { name, briefs, count: briefs.length, programmes };
      });
    },

    briefsByArea: (state) => (areaName) => {
      if (!state.bank) return [];
      return state.bank.briefs.filter((b) => b.area === areaName);
    },

    briefById: (state) => (id) => {
      if (!state.bank) return null;
      return state.bank.briefs.find((b) => b.id === id) ?? null;
    },

    shortlistBriefs(state) {
      if (!state.bank) return [];
      return state.shortlist
        .map((id) => state.bank.briefs.find((b) => b.id === id))
        .filter(Boolean);
    },

    canSubmit: (state) => state.shortlist.length >= 1,
    isInShortlist: (state) => (id) => state.shortlist.includes(id),
    shortlistFull: (state) => state.shortlist.length >= 4,
  },

  actions: {
    async loadBank() {
      if (this.bank) return;
      try {
        const resp = await fetch('bank.public.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        this.bank = await resp.json();
      } catch (e) {
        this.bankError = e.message;
      }
    },

    addToShortlist(briefId) {
      if (this.shortlist.includes(briefId) || this.shortlist.length >= 4) return;
      const brief = this.bank?.briefs.find((b) => b.id === briefId);
      if (!brief) return;
      this.shortlist.push(briefId);
      this.shortlistArea = brief.area;
    },

    removeFromShortlist(briefId) {
      this.shortlist = this.shortlist.filter((id) => id !== briefId);
      if (this.shortlist.length === 0) this.shortlistArea = '';
    },

    reorderShortlist(ids) {
      this.shortlist = ids;
    },

    switchAreaAndAdd(briefId, area) {
      this.shortlist = [briefId];
      this.shortlistArea = area;
    },

    setStudent(partial) {
      this.student = { ...this.student, ...partial };
    },

    clearShortlist() {
      this.shortlist = [];
      this.shortlistArea = '';
    },

    submitRanking() {
      const payload = {
        module: this.bank.module,
        bank_version: this.bank.bank_version,
        student: { ...this.student },
        area: this.shortlistArea,
        ranking: [...this.shortlist],
        submitted_at: new Date().toISOString(),
      };
      this.submitted = payload;
      return payload;
    },
  },
});
