<template>
  <div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-12" v-if="view == 'description'">
          <p class="description-content">
            Invoking the Inward Batch Endpoint allows a bank to retrieve a set
            of transactions corresponding to a batch by using the Inward Batch
            Sequence Number that was retrieved using the Index Endpoint.
          </p>

          <form class="send-inward-batch">
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
          elementName: "FIToFICstmrCdtTrf",
          description: "",
        },
        {
          tab: 1,
          elementName: "GrpHdr",
          description:
            "The Group Header contains information that is specific to a particular batch. For example, the total amount of the transactions, as well the number of transactions in a particular batch is declared and validated against the transactions contained in the batch. ",
        },
        {
          tab: 2,
          elementName: "MsgId",
          description:
            "Batch ID (should be kept null and will be assigned by PCHC)",
        },
        {
          tab: 2,
          elementName: "CreDtTm",
          description:
            "Settlement Date and Time (should be kept null and will be assigned by PCHC)",
        },
        {
          tab: 2,
          elementName: "NbOfTxs",
          description: "Total Number of Transactions in the Batch",
        },
        {
          tab: 2,
          elementName: "TtlIntrBkSttlmAmt",
          description: "",
        },
        {
          tab: 3,
          elementName: "Ccy",
          description: "Currency (should be PHP)",
        },
        {
          tab: 3,
          elementName: "value",
          description:
            "Total Amount of the Transactions Contained in the Batch",
        },
        {
          tab: 2,
          elementName: "IntrBkSttlmDt",
          description:
            "Settlement Date (should be kept null and will be assigned by PCHC)",
        },
        {
          tab: 2,
          elementName: "SttlmInf",
          description: "",
        },
        {
          tab: 3,
          elementName: "SttlmMtd",
          description:
            "Settlement Method (value is not used should be kept as CLRG)",
        },
        {
          tab: 2,
          elementName: "InstgAgt",
          description: "",
        },
        {
          tab: 3,
          elementName: "FinInstnId",
          description: "",
        },
        {
          tab: 4,
          elementName: "BICFI",
          description: "BIC of the Sending Bank",
        },
        {
          tab: 2,
          elementName: "InstdAgt",
          description: "",
        },
        {
          tab: 3,
          elementName: "FinInstnId",
          description: "",
        },
        {
          tab: 4,
          elementName: "BICFI",
          description: "BIC of PCHC",
        },
        {
          tab: 1,
          elementName: "CdtTrfTxInf",
          description:
            "Each ISO 20022 pacs.008 message may contain up to 200 transactions. Each transaction is marshalled as an element of the CdtTrfTxInf element as an array.",
        },
        {
          tab: 2,
          elementName: "PmtId",
          description: "",
        },
        {
          tab: 3,
          elementName: "EndToEndId",
          description:
            "Payment ID/Sequence Number (should be kept null and will be assigned by PCHC)",
        },
        {
          tab: 3,
          elementName: "TxId",
          description:
            "OFI Reference Number, a unique identifier provided by the OFI for its identification of the transaction.",
        },
        {
          tab: 2,
          elementName: "PmtTpInf",
          description: "Total Number of Transactions in the Batch",
        },
        {
          tab: 3,
          elementName: "SvcLvl",
          description: "Total Number of Transactions in the Batch",
        },
        {
          tab: 4,
          elementName: "Prtry",
          description:
            "Priority Code (value is not used and should be kept as NURG)",
        },
        {
          tab: 3,
          elementName: "CtgyPurp",
          description:
            "Total Amount of the Transactions Contained in the Batch",
        },
        {
          tab: 4,
          elementName: "Cd",
          description:
            "Category Purpose Code (value is not used and should be kept as CASH)",
        },
        {
          tab: 2,
          elementName: "IntrBnkSttlmAmt",
          description: "",
        },
        {
          tab: 3,
          elementName: "Ccy",
          description:
            "Currency (currency of the transaction, only PHP is accepted in PESO Net)",
        },
        {
          tab: 3,
          elementName: "value",
          description: "Amount amount of the transaction",
        },
        {
          tab: 2,
          elementName: "ChrgBr",
          description:
            "Charge Bearer (value is not used and should be kept as SLEV",
        },
        {
          tab: 2,
          elementName: "Dbtr",
          description: "",
        },
        {
          tab: 3,
          elementName: "Nm",
          description: "Debtor/Remitter Name",
        },
        {
          tab: 3,
          elementName: "PstlAdr",
          description:
            "Debtor/Remitter Address An array (maximum of 4 strings) of the remitter’s addres",
        },
        {
          tab: 2,
          elementName: "DbtrAcct",
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
          description: "Debtor/Remitter Account Number",
        },
        {
          tab: 2,
          elementName: "DbtrAgt",
          description: "",
        },
        {
          tab: 3,
          elementName: "FinInstnId",
          description: "",
        },
        {
          tab: 4,
          elementName: "BICFI",
          description: "BIC of Originating Institution",
        },
        {
          tab: 2,
          elementName: "Cdtr",
          description: "BIC of Originating Institution",
        },
        {
          tab: 3,
          elementName: "Nm",
          description: "Creditor/Beneficiary Name",
        },
        {
          tab: 3,
          elementName: "PstlAdr",
          description:
            "Creditor/Beneficiary Address An array (maximum of 4 strings) of the beneficiary’s address",
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
          description: "Creditor/Beneficiary Account Number",
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
          elementName: "BICFI",
          description: "Creditor/Beneficiary Bank BIC",
        },
        {
          tab: 2,
          elementName: "RmtInf",
          description: "",
        },
        {
          tab: 3,
          elementName: "Ustrd",
          description: "",
        },
        {
          tab: 4,
          elementName: "rfi_reference_number",
          description: "RFI Reference Number",
        },
        {
          tab: 4,
          elementName: "ofi_customer_reference_number",
          description: "OFI Customer Reference Number",
        },
        {
          tab: 4,
          elementName: "rfi_customer_reference_number",
          description: "RFI Customer Reference Number",
        },
        {
          tab: 4,
          elementName: "instructions",
          description: "Instructions",
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
      const valid = $(".send-inward-batch").valid();
  
      if (!valid) return;

      this.view = "output";
      this.isLoading = 1;
      const { status, data, responseStatus } = await this.$store.dispatch(
        "api/sendInwardBatch",
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
    $(".send-inward-batch").validate({
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
