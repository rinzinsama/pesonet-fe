import axios from "axios";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "user";

export default {
  namespaced: true,
  actions: {
    async getUsers({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getUsers`, payload)
      );

      return serialize(err?.response || data);
    },

    async getUser({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getUser`, payload)
      );

      return serialize(err?.response || data);
    },

    async createUser({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/createUser`, payload)
      );

      return serialize(err?.response || data);
    },

    async updateUser({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/updateUser`, payload)
      );

      return serialize(err?.response || data);
    },

    async deleteUser({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/deleteUser`, payload)
      );

      return serialize(err?.response || data);
    },

    async unlockUser({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/unlockUser`, payload)
      );

      return serialize(err?.response || data);
    },

    async changePassword({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/changePassword`, payload)
      );

      return serialize(err?.response || data);
    },
  },
};
