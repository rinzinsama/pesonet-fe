import axios from "axios";
import router from "../../router/router";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "banklist";

export default {
  namespaced: true,
  actions: {
    async getBankList({ rootState }) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getBankList`)
      );

      return serialize(err?.response || data);
    },

    async manualSyncBankList({ rootState }) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/manualSyncBankList`)
      );

      return serialize(err?.response || data);
    },

    async updateBank({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/updateBank`, payload)
      );

      return serialize(err?.response || data);
    },

    async getBankBIC({ rootState }) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getBankBIC`)
      );

      return serialize(err?.response || data);
    },
  },
};
