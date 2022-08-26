import axios from "axios";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "transactionlist";

export default {
  namespaced: true,
  actions: {
    async getTransactionList({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/getTransactionList`,
          payload
        )
      );
      // console.log(data,"transactionList")

      return serialize(err?.response || data);
    },

    async getTransaction({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getTransaction`, payload)
      );

      return serialize(err?.response || data);
    },

    async getTransactionToday({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/getTransactionToday`,
          payload
        )
      );

      return serialize(err?.response || data);
    },
  },
};
