<template>
  <div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-12" v-if="view == 'description'">
          <p class="description-content">
            The Outward Message Status Update Endpoint allows a bank to
            determine the status of the transactions that it has sent.
          </p>

          <form class="send-outward-message-status-update">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-control-label">SEQUENCE NUMBER</label>
                  <input
                    type="text"
                    class="form-control"
                    name="sequenceNumber"
                    v-model="sequenceNumber"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="col-md-12" v-if="isLoading == 1">
          <div class="row">
            <div class="col-md-12 pt-3 pb-3">
              <app-loader />
            </div>
          </div>
        </div>

        <div
          class="col-md-6"
          v-if="view == 'output' && isLoading == 0 && output.length > 0"
        >
          <h3>RESPONSE PAYLOAD DETAILS</h3>
          <div class="table-responsive">
            <table class="table align-items-center table-dark">
              <thead class="thead-dark">
                <tr>
                  <th scope="col"><b>ELEMENT NAME</b></th>
                  <th scope="col"><b>DESCRIPTION</b></th>
                </tr>
              </thead>
              <tbody class="list">
                <tr v-for="(data, index) in table" :key="index">
                  <td :style="{ textIndent: getTabs(data.tab) }">
                    {{ data.elementName }}
                  </td>
                  <td v-html="data.description"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          class="col-md-6"
          v-if="view == 'output' && isLoading == 0 && output.length > 0"
        >
          <h3>RESPONSE</h3>
          <h4>
            STATUS CODE:
            <span :class="status == 200 ? 'text-success' : 'text-danger'">{{
              status
            }}</span>
          </h4>
          <pre class="p-4 code-section" v-html="output"></pre>
        </div>

        <div
          class="col-md-12"
          v-if="view == 'output' && isLoading == 0 && output.length == 0"
        >
          <div class="row">
            <div class="col-md-12 text-center no-data-found">
              <h1>Failed to connect to Pesonet API.</h1>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer" v-if="isLoading == 0">
      <button
        type="button"
        v-if="view == 'output'"
        class="btn btn-danger"
        @click.prevent="goBack"
      >
        BACK
      </button>
      <button
        type="button"
        v-if="view == 'description'"
        class="btn btn-success"
        @click.prevent="submit"
      >
        SUBMIT
      </button>
    </div>
  </div>
</template>

<script>
import Prism from "prismjs";
import json from "prismjs/components/prism-json";
import Loader from "../../../master/Loader";

export default {
  components: {
    appLoader: Loader,
  },

  props: ["modalStatus"],

  data() {
    return {
      isLoading: 0,
      view: "description",
      sequenceNumber: "",
      output: "",
      status: "",
      table: [
        {
          tab: 0,
          elementName: "GrpHdr",
          description: "Group Header",
        },
        {
          tab: 1,
          elementName: "MsgId",
          description:
            "Outward Message ID – refers to sequence number of the original Outward Message",
        },
        {
          tab: 1,
          elementName: "CreDtTm",
          description:
            "Settlement Date and Time – refers to the cut-off time for settlement of this message, null if the message has not yet been processed by PESO Net.",
        },
        {
          tab: 1,
          elementName: "OrgnlGrpInfAndSts",
          description: "",
        },
        {
          tab: 2,
          elementName: "OrgnlMsgId",
          description:
            "Original Message ID – refers to the sequence number of the original Outward Message",
        },
        {
          tab: 2,
          elementName: "OrgnlMsgNmId",
          description:
            "Original Message Name ID – refers to the message type of the original Outward Message",
        },
        {
          tab: 2,
          elementName: "GrpSts",
          description:
            "Group Status – Status in Processing the Batch <br> *Accepted and Settlement Completed (ACCC) - status if the transactions have been accepted, with settlement having been completed on the transactions <br> *Partially Accepted (PART) – some items in the batch have been accepted and processed <br> *Pending (PNDG) – the transactions currently being processed <br> *Received (RCVD) – the batch has been received, but has not begun processing <br> *Reject (RJCT) – all of the transactions in the batch have been rejected.",
        },
        {
          tab: 1,
          elementName: "InstgAgt",
          description: "",
        },
        {
          tab: 2,
          elementName: "FinInstnId",
          description: "",
        },
        {
          tab: 3,
          elementName: "BICFI",
          description: "BIC of PCHC",
        },
        {
          tab: 1,
          elementName: "InstdAgt",
          description: "",
        },
        {
          tab: 2,
          elementName: "FinInstnId",
          description: "",
        },
        {
          tab: 3,
          elementName: "BICFI",
          description: "BIC of the bank that sent the original message",
        },
        {
          tab: 0,
          elementName: "TxInfAndSts",
          description: "Transaction Information and Status",
        },
        {
          tab: 1,
          elementName: "OrgnlGrpInf",
          description: "",
        },
        {
          tab: 2,
          elementName: "OrgnlMsgId",
          description: "Original Message ID (Batch ID)",
        },
        {
          tab: 2,
          elementName: "OrgnlMsgNmId",
          description: "Original Message Name (always pacs.008)",
        },
        {
          tab: 1,
          elementName: "OrgnlEndToEndId",
          description: "Original ID/Sequence Number for the transaction",
        },
        {
          tab: 1,
          elementName: "OrgnlTxId",
          description: "Original OFI Reference Number for the transaction",
        },
        {
          tab: 1,
          elementName: "TxSts",
          description: "ISO 20022 Status Code of the Transaction’s Status",
        },
        {
          tab: 1,
          elementName: "StsRsnInf",
          description: "",
        },
        {
          tab: 2,
          elementName: "AddtlInf",
          description: "Remarks/Narrative",
        },
        {
          tab: 1,
          elementName: "AccptncDtTm",
          description:
            "Acceptance Date/Time (time when the transaction status was updated)",
        },
        {
          tab: 1,
          elementName: "OrgnlTxRef",
          description: "",
        },
        {
          tab: 2,
          elementName: "Amt",
          description: "",
        },
        {
          tab: 3,
          elementName: "EqvtAmt",
          description: "",
        },
        {
          tab: 4,
          elementName: "Amt",
          description:
            "Credited Amount – amount that was ultimately credited to the beneficiary",
        },
        {
          tab: 4,
          elementName: "CcyOfTrf",
          description:
            "Credited Currency – currency that was credited to the beneficiary",
        },
        {
          tab: 2,
          elementName: "Cdtr",
          description: "",
        },
        {
          tab: 3,
          elementName: "Nm",
          description:
            "Creditor/Beneficiary Name – name or account title of the account that was credited",
        },
        {
          tab: 2,
          elementName: "CdtrAcct",
          description: "",
        },
        {
          tab: 3,
          elementName: "Id",
          description: "",
        },
        {
          tab: 4,
          elementName: "Othr",
          description: "",
        },
        {
          tab: 5,
          elementName: "Id",
          description:
            "Creditor/Beneficiary Account Number – final account number that was credited",
        },
        {
          tab: 2,
          elementName: "CdtrAgt",
          description: "",
        },
        {
          tab: 3,
          elementName: "FinInstnId",
          description: "",
        },
        {
          tab: 4,
          elementName: "BIC",
          description: "BIC of the Creditor/Beneficiary Bank",
        },
      ],
    };
  },

  watch: {
    modalStatus(newVal, oldVal) {
      if (newVal == 0) this.resetData();
    },
  },

  methods: {
    resetData() {
      this.view = "description";
      this.output = "";
      this.sequenceNumber = "";
    },

    goBack() {
      this.resetData();
    },

    getTabs(count) {
      return `${+count * 30}px`;
    },

    async submit() {
      const valid = $(".send-outward-message-status-update").valid();

      if (!valid) return;

      this.view = "output";
      this.isLoading = 1;
      const { status, data, responseStatus } = await this.$store.dispatch(
        "api/sendOutwardMessageStatusUpdate",
        {
          sequenceNumber: this.sequenceNumber,
        }
      );

      this.output = data
        ? Prism.highlight(
            JSON.stringify(data, null, 4),
            Prism.languages.json,
            "json"
          )
        : "";
      this.status = responseStatus || "";

      this.isLoading = 0;
    },
  },

  mounted() {
    $(".send-outward-message-status-update").validate({
      rules: {
        sequenceNumber: {
          required: true,
        },
      },
      errorClass: "jv-error",
      errorPlacement: function(error, element) {
        element.closest(".form-group").append(error);
      },
      highlight: (element, errorClass) => {
        $(element).addClass("is-invalid");
        $(element).removeClass("form-control-alternative");
      },
      unhighlight: (element, errorClass) => {
        $(element).removeClass("is-invalid");
        $(element).addClass("form-control-alternative");
      },
    });
  },
};
</script>

<style scoped>
p.description-content {
  font-weight: normal;
  color: #000;
  font-size: 20px;
}

.code-section {
  font-weight: bold;
  background-color: #ddd;
}

.table-responsive {
  height: calc(100vh - 308px);
}
</style>
