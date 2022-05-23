import axios from "axios";
import router from "../../router/router";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "outward";

export default {
  namespaced: true,
  actions: {
    async getOutwardBatch({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getOutwardBatch`, payload)
      );

      return serialize(err?.response || data);
    },

    async manualSyncOutwardBatch({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/manualSyncOutwardBatch`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async getTransactionsRaw({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/getTransactionsRaw`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async getTransactions({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getTransactions`, payload)
      );

      return serialize(err?.response || data);
    },

    async createOutwardMessage({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/createOutwardMessage`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async reject({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/reject`, payload)
      );

      return serialize(err?.response || data);
    },

    async saveOutwardMessage({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/saveOutwardMessage`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async sendOutwardMessage({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/sendOutwardMessage`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async uploadOutward({ rootState }, payload) {
      const options = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/uploadOutward`,
          payload,
          options
        )
      );

      return serialize(err?.response || data);
    },

    async generatePDF({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/generatePDF`, payload)
      );

      return serialize(err?.response || data);
    },

    async validateOutwardMessage({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/validateOutwardMessage`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async checkOutwardProcessing({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/checkOutwardProcessing`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async enableOutwardProcessing({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/enableOutwardProcessing`,
          payload
        )
      );

      return serialize(err?.response || data);
    },
  },
};
