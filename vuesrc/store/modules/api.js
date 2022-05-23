import axios from "axios";
import router from "../../router/router";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "api";

export default {
  namespaced: true,
  actions: {
    async getApiUrl({ rootState }) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getApiUrl`)
      );

      return serialize(err?.response || data);
    },

    async getApiSettings({ rootState }) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getApiSettings`)
      );

      return serialize(err?.response || data);
    },

    async uploadCreds({ rootState }, payload) {
      const options = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/uploadCreds`,
          payload,
          options
        )
      );

      return serialize(err?.response || data);
    },

    async updateAPISettings({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/updateAPISettings`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async sendHeartbeat({ rootState }) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/sendHeartbeat`)
      );

      return serialize(err?.response || data);
    },

    async sendBankList({ rootState }) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/sendBankList`)
      );

      return serialize(err?.response || data);
    },

    async sendIndex({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/sendIndex`, payload)
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

    async sendOutwardMessageStatusUpdate({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/sendOutwardMessageStatusUpdate`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async sendOutwardMessageSearch({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/sendOutwardMessageSearch`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async sendInwardBatch({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/sendInwardBatch`, payload)
      );

      return serialize(err?.response || data);
    },

    async sendInwardBatchStatusUpdate({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/sendInwardBatchStatusUpdate`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async getLogs({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getLogs`, payload)
      );

      return serialize(err?.response || data);
    },
  },
};
