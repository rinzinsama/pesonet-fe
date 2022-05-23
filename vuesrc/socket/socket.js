import Vue from "vue";
import VueSocketIO from "vue-socket.io";

Vue.use(
  new VueSocketIO({
    connection: process.env.MIX_API_BASE,
    options: { path: "/web-socket", transports: ["polling"] },
  })
);
