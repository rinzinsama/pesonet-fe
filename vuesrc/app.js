require("./lib/Autoload");
require("./lib/Interceptors");
require("./lib/Popover");

import Vue from "vue";
import App from "./components/App.vue";
import { store } from "./store/store";
import router from "./router/router";
require("./socket/socket");

new Vue({
  render: h => h(App),
  store,
  router
}).$mount("#app");
