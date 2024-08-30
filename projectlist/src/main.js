import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./quasar";

Vue.config.productionTip = false;
Vue.use(router);

Vue.mixin({
  methods: {
    showError(err) {
      console.log(err);
      this.$q.notify({
        type: "negative",
        message: this.$t("err"),
      });
    },
  },
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
