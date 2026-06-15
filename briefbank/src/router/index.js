import { createRouter, createWebHashHistory } from 'vue-router';
import AreaPicker from '@/pages/AreaPicker.vue';
import AreaBrowse from '@/pages/AreaBrowse.vue';
import BriefDetail from '@/pages/BriefDetail.vue';
import ShortlistPage from '@/pages/Shortlist.vue';
import Confirmation from '@/pages/Confirmation.vue';

const routes = [
  { path: '/', name: 'home', component: AreaPicker },
  { path: '/area/:slug', name: 'area', component: AreaBrowse },
  { path: '/area/:slug/brief/:id', name: 'brief', component: BriefDetail },
  { path: '/shortlist', name: 'shortlist', component: ShortlistPage },
  { path: '/confirm', name: 'confirm', component: Confirmation },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes,
});
