import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "./routes";
import { store } from "../store/store";

Vue.use(VueRouter);

const router = new VueRouter({
  base: process.env.MIX_ROUTER_BASE,
  routes,
  mode: "history",
});

router.beforeEach((to, from, next) => {
  document.title = `PESONET ${to.name == "Base" ? "" : " | " + to.name}`;

  store.commit("setNotFound", to.name == "Page Not Found" ? true : false);

  if (
    Object.keys(store.state.session).length > 0 &&
    typeof to.meta.module_id != "undefined" &&
    !store.state.session.modules.includes(to.meta.module_id)
  )
    next({ name: "Page Not Found" });

  next();
});

export default router;
