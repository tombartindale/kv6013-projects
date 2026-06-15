import { createApp } from 'vue';
import { Quasar } from 'quasar';
import { createPinia } from 'pinia';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import App from './App.vue';
import router from './router';
import { useBriefBankStore } from './store';

const app = createApp(App);
const pinia = createPinia();

app.use(Quasar, { plugins: {} });
app.use(pinia);
app.use(router);

// Wire up localStorage persistence after pinia is active
const store = useBriefBankStore();
store.$subscribe((_, state) => {
  try {
    localStorage.setItem(
      'kv6013-briefbank',
      JSON.stringify({
        shortlist: state.shortlist,
        shortlistArea: state.shortlistArea,
        student: state.student,
      })
    );
  } catch (_) {}
});

app.mount('#app');
