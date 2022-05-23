import axios from "axios";
import router from "../../router/router";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "auth";

export default {
  namespaced: true,
  actions: {
    async checkUsername({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/checkUsername`, payload)
      );

      return serialize(err?.response || data);
    },

    async login({ commit, rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/login`, payload)
      );

      if (data) {
        const { user, modules } = data.data.data;

        let session = {
          ...user,
          modules: modules.map(mod => mod.module)
        };

        commit("setSession", session, { root: true });
        commit("setIsLogged", true, { root: true });
        if (rootState.session.isPasswordChanged == 0)
          router.push({ name: "Change Password" }).catch(err => {});
        else router.push({ name: "Dashboard" }).catch(err => {});
      }

      return serialize(err?.response || data);
    },

    async reconnect({ commit, rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/reconnect`)
      );

      if (data) {
        const { user, modules } = data.data.data;

        let session = {
          ...user,
          modules: modules.map(mod => mod.module)
        };
        commit("setSession", session, { root: true });
        commit("setIsLogged", true, { root: true });
        commit("setFullLoader", false, { root: true });
        if (rootState.session.isPasswordChanged == 0)
          router.push({ name: "Change Password" }).catch(err => {});
        else if (router.currentRoute.name == "Base")
          router.push({ name: "Dashboard" }).catch(err => {});
      }

      return serialize(err?.response || data);
    },

    async logout({ commit, rootState }) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/logout`)
      );

      commit("setSession", "", {
        root: true
      });
      commit("setIsLogged", false, {
        root: true
      });

      localStorage.clear();
      router.push({ name: "Base" }).catch(err => {});
      return serialize(err?.response || data);
    },

    async removeSession({ commit }) {
      commit("setSession", "", {
        root: true
      });
      commit("setIsLogged", false, {
        root: true
      });
      commit("setFullLoader", false, {
        root: true
      });
      localStorage.clear();
      router.push({ name: "Base" }).catch(err => {});
    }
  }
};
