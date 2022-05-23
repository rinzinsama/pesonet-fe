import axios from "axios";
import router from "../../router/router";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "scheduler";

export default {
  namespaced: true,
  actions: {
    async getSchedulerLogs({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getSchedulerLogs`, payload)
      );

      return serialize(err?.response || data);
    },

    async getLastSync({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getLastSync`, payload)
      );

      return serialize(err?.response || data);
    },

    async syncIndex({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/syncIndex`, payload)
      );

      return serialize(err?.response || data);
    },

    async syncBankList({ rootState }) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/syncBankList`)
      );

      return serialize(err?.response || data);
    },

    async isSyncing({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/isSyncing`, payload)
      );

      return serialize(err?.response || data);
    },
  },
};
