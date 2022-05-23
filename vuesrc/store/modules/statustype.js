import axios from "axios";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "statustype";

export default {
  namespaced: true,
  actions: {
    async getTypes({ rootState }) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getTypes`)
      );

      return serialize(err?.response || data);
    },
  },
};
