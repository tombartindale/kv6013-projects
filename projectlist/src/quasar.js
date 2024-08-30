import Vue from "vue";
import "./styles/quasar.scss";
import "quasar/dist/quasar.ie.polyfills";
// import "@quasar/extras/material-icons/material-icons.css";
import iconSet from "quasar/icon-set/svg-material-icons";
import { Quasar, Meta, Loading, Notify, LocalStorage } from "quasar";

Vue.use(Quasar, {
  rtl: true,
  iconSet: iconSet,
  plugins: {
    Meta,
    Loading,
    Notify,
    LocalStorage,
  },
});
