import axios from "axios";
import to from "await-to-js";
import { serialize } from "../../lib/AxiosSerializer";

let model = "report";

export default {
  namespaced: true,
  actions: {
    async generateOutwardTransactionReport({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/generateOutwardTransactionReport`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async generateInwardTransactionReport({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/generateInwardTransactionReport`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async generateTransactionXLSX({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/generateTransactionXLSX`,
          payload,
          {
            responseType: "blob",
          }
        )
      );

      return serialize(err?.response || data);
    },

    async generateTransactionPDF({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/generateTransactionPDF`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async generateTransactionPDFTable({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/generateTransactionPDFTable`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async GeneratePesonetReport({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/GeneratePesonetReport`,
          payload
        )
      );

      return serialize(err?.response || data);
    },

    async generatePesonetReportPDF({ rootState }, payload) {
      const [err, data] = await to(
        axios.post(
          `${rootState.apiBaseUrl}/${model}/generatePesonetReportPDF`,
          payload
        )
      );

      return serialize(err?.response || data);
    },
  },
};
