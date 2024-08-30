import Vue from "vue";
import "./styles/quasar.scss";
import "quasar/dist/quasar.ie.polyfills";
// import "@quasar/extras/material-icons/material-icons.css";
// import iconSet from "quasar/icon-set/svg-material-icons";
import { Quasar, Meta, Loading, Notify } from "quasar";

Vue.use(Quasar, {
  // iconSet: iconSet,
  plugins: {
    Meta,
    Loading,
    Notify,
  },
});
