import axios from "axios";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "reader";

export default {
  namespaced: true,
  actions: {
    async checkStatus({ rootState }) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/checkStatus`)
      );

      return serialize(err?.response || data);
    },

    async updatePath({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/updatePath`, payload)
      );

      return serialize(err?.response || data);
    },

    async getLogs({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getLogs`, payload)
      );

      return serialize(err?.response || data);
    },

    async getLogsByDate({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getLogsByDate`, payload)
      );

      return serialize(err?.response || data);
    },

    async downloadGeneratedFile({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/downloadGeneratedFile`,
          payload,
          { responseType: "blob" }
        )
      );

      return err ? false : data.data;
    },
  },
};
