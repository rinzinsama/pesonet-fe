import axios from "axios";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "role";

export default {
  namespaced: true,
  actions: {
    async getRoles({ rootState }) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getRoles`)
      );

      return serialize(err?.response || data);
    }
  }
};
