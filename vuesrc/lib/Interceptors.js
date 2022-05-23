import axios from "axios";
import { store } from "../store/store";
import router from "../router/router";
import Popover from "./Popover";

axios.interceptors.request.use(config => {
  if (localStorage.getItem("token"))
    config.headers.authorization = localStorage.getItem("token");

  return config;
});

axios.interceptors.response.use(
  response => {
    let token = response.headers.authorization;
    if (token) localStorage.setItem("token", token);

    return response;
  },
  error => {
    if (error.response.status == 401) {
      jconfirm.instances.forEach(instance => {
        instance.close();
      });

      router.push({ name: "Base" }).catch(err => {});
      store.dispatch("auth/removeSession");

      Popover.popover({
        icon: "fas fa-exclamation-triangle",
        title: "Session Time Out.",
        content: "",
        buttons: {
          ok: {
            text: "ok",
            btnClass: "btn-success",
            keys: ["enter"]
          }
        }
      });
    }

    return Promise.reject(error);
  }
);
