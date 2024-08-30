import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/locale/:locale",
  //   name: "locale",
  //   // alias: "/",
  //   // name: "root",
  //   component: () => import("@/publicview/LandingPage"),
  // },
  // {
  //   path: "/policy",
  //   component: () => import("@/publicview/TcsCs"),
  //   name: "policy",
  // },
  // {
  //   path: "/showcase",
  //   component: () => import("@/publicview/ShowCase"),
  //   name: "showcase",
  // },
  // {
  //   path: "/training",
  //   component: () => import("@/publicview/LeadTraining"),
  //   name: "training",
  // },
  // {
  //   path: "/research",
  //   component: () => import("@/publicview/Research"),
  //   name: "research",
  // },
  // {
  //   path: "/lead",
  //   name: "lead",
  //   component: () => import("@/publicview/Lead"),
  // },
  // {
  //   path: "/academy",
  //   name: "academy",
  //   component: () => import("@/publicview/Academy"),
  // },
  // {
  //   path: "/academy/resources",
  //   name: "academytraining",
  //   component: () => import("@/publicview/AcademyTraining"),
  // },
  // {
  //   path: "/submission",
  //   component: () => import("@/pages/Submission"),
  //   children: [
  //     {
  //       path: "",
  //       name: "submission",
  //       component: () => import("@/pages/SubmissionList"),
  //     },
  //     {
  //       path: "make/:selectedphase?",
  //       component: () => import("@/pages/SubmissionForm"),
  //       props: true,
  //     },
  //     {
  //       path: "continue/:id",
  //       component: () => import("@/pages/ContinueForm"),
  //       props: true,
  //     },
  //     {
  //       path: "portfolio",
  //       component: () => import("@/pages/Portfolio"),
  //       props: true,
  //     },
  //   ],
  //   meta: {
  //     requiresAuth: true,
  //   },
  // },

  // {
  //   path: "/:token?",
  //   alias: "/",
  //   name: "root",
  //   component: () => import("@/publicview/LandingPage"),
  // },
  {
    path: "*",
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (to.hash) {
        // console.log("scrolling");
        // console.log(to.hash);
        return {
          selector: to.hash,
          behavior: "smooth",
          offset: { x: 0, y: 120 },
        };
      } else return { x: 0, y: 0 };
    }
  },
});

// import { loadLanguageAsync } from "../i18n";

// router.beforeEach(async (to, from, next) => {
//   const currentUser = await getCurrentUser();
//   // console.log(to.path);
//   if (currentUser && to.path.startsWith("/login")) return next("/submission");
//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
//   if (!requiresAuth) next();
//   if (requiresAuth && !currentUser) next("academy");
//   else if (requiresAuth && currentUser) next();
// });

export default router;
