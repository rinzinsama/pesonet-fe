import axios from "axios";
import router from "../../router/router";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "inward";

export default {
  namespaced: true,
  actions: {
    async getInwardBatch({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/getInwardBatch`, payload)
      );

      return serialize(err?.response || data);
    },

    async getConsolidatedInwardBatch({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/getConsolidatedInwardBatch`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async manualSyncInwardBatch({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/manualSyncInwardBatch`,
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

    async downloadFile({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/downloadFile`, payload, {
          responseType: "blob",
        })
      );

      return err ? false : data.data;
    },

    async updateStatus({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/updateStatus`, payload)
      );

      return serialize(err?.response || data);
    },

    async reject({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/reject`, payload)
      );

      return serialize(err?.response || data);
    },

    async sendStatus({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/sendStatus`, payload)
      );

      return serialize(err?.response || data);
    },

    async generatePDF({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/generatePDF`, payload)
      );

      return serialize(err?.response || data);
    },

    async generateFilePDF({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/generateFilePDF`, payload)
      );

      return serialize(err?.response || data);
    },

    async getTransactionForFileGeneration({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/getTransactionForFileGeneration`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async downloadGroupFile({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/downloadGroupFile`,
          payload,
          {
            responseType: "blob",
          }
        )
      );

      return err ? false : data.data;
    },

    async getConsolidatedTransactions({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/getConsolidatedTransactions`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async saveConsolidatedInward({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/saveConsolidatedInward`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async regenerateFiles({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/regenerateFiles`, payload)
      );

      return serialize(err?.response || data);
    },

    async getConsolidatedTotals({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/getConsolidatedTotals`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async getInwardConsolidatedLogs({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/getInwardConsolidatedLogs`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async checkForResync({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/checkForResync`, payload)
      );

      return serialize(err?.response || data);
    },

    async reSyncInward({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/reSyncInward`, payload)
      );

      return serialize(err?.response || data);
    },

    async generatePDFTable({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(`${rootState.apiBaseUrl}/${model}/generatePDFTable`, payload)
      );

      return serialize(err?.response || data);
    },
  },
};
