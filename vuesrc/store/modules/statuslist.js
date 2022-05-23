import axios from "axios";
import router from "../../router/router";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "statuslist";

export default {
  namespaced: true,
  actions: {
    async getLists({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getLists`, payload)
      );

      return serialize(err?.response || data);
    },

    async getListsActive({ rootState }) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getListsActive`)
      );

      return serialize(err?.response || data);
    },

    async getList({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getList`, payload)
      );

      return serialize(err?.response || data);
    },

    async createStatus({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/createStatus`, payload)
      );

      return serialize(err?.response || data);
    },

    async updateStatus({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/updateStatus`, payload)
      );

      return serialize(err?.response || data);
    },
  },
};
