import axios from "axios";
import router from "../../router/router";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "audit";

export default {
  namespaced: true,
  actions: {
    async getAuditTrail({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getAuditTrail`, payload)
      );

      return serialize(err?.response || data);
    },
  },
};
