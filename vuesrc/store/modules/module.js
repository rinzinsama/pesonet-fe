import axios from "axios";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "module";

export default {
  namespaced: true,
  actions: {
    async getModules({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getModules`, payload)
      );

      return serialize(err?.response || data);
    },

    async getRoleModules({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getRoleModules`, payload)
      );

      return serialize(err?.response || data);
    },

    async updateModule({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/updateModule`, payload)
      );

      return serialize(err?.response || data);
    }
  }
};
