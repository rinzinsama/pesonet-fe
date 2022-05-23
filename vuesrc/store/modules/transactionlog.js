import axios from "axios";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "transactionlog";

export default {
  namespaced: true,
  actions: {
    async getLogs({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getLogs`, payload)
      );

      return serialize(err?.response || data);
    },
  },
};
