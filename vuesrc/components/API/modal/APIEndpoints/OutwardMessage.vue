<template>
  <div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-12" v-if="view == 'description'">
          <p class="description-content">
            Invoking the Outward Message Endpoint allows a bank to send an ISO
            20022 pacs.008 message in JSON syntax that contains transactions for
            processing via PESO Net.
          </p>

          <form class="send-outward-message">
            <h3>HEADER</h3>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-control-label"
                    >BIC OF THE SENDING BANK</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    name="bicOfBank"
                    v-model="bicOfBank"
                  />
                </div>
              </div>
            </div>

            <h3 class="my-3">TRANSACTIONS</h3>

            <div class="accordion" id="transactionAccordion">
              <div
                class="card mb-0"
                v-for="(transaction, index) in transactions"
                :key="index"
              >
                <div
                  class="card-header bg-info text-white"
                  :id="`heading${index}`"
                  data-toggle="collapse"
                  :data-target="`#collapse${index}`"
                  aria-expanded="false"
                  :aria-controls="`collapse${index}`"
                >
                  <div class="row">
                    <div class="col-md-6">
                      <h3 class="mb-0 text-white">
                        TRANSACTION #{{ index + 1 }}
                      </h3>
                    </div>
                    <div class="col-md-6 text-right pr-5">
                      <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        v-if="transactions.length > 1"
                        @click.stop.prevent="removeTransaction(index)"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  :id="`collapse${index}`"
                  class="collapse"
                  :aria-labelledby="`heading${index}`"
                  data-parent="#transactionAccordion"
                >
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >OFI REFERENCE NUMBER</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            maxlength="16"
                            name="ofiReferenceNumber[]"
                            v-model="transaction.ofiReferenceNumber"
                          />
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label">AMOUNT</label>
                          <input
                            type="text"
                            class="form-control money"
                            name="amount[]"
                            :value="transaction.amount"
                            @keyup="setValue($event, 'amount', index)"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >DEBTOR/REMITTER NAME</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            maxlength="50"
                            name="remitterName[]"
                            v-model="transaction.remitterName"
                          />
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >DEBTOR/REMITTER ADDRESS</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            name="remitterAddress[]"
                            v-model="transaction.remitterAddress"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >DEBTOR/REMITTER ACCOUNT NUMBER</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            maxlength="16"
                            name="remitterAccountNumber[]"
                            v-model="transaction.remitterAccountNumber"
                          />
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >BIC OF ORIGINATING INSTITUTION</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            name="remitterBIC[]"
                            v-model="transaction.remitterBIC"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >CREDITOR/BENEFICIARY NAME</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            maxlength="50"
                            name="beneficiaryName[]"
                            v-model="transaction.beneficiaryName"
                          />
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >CREDITOR/BENEFICIARY ADDRESS</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            name="beneficiaryAddress[]"
                            v-model="transaction.beneficiaryAddress"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >CREDITOR/BENEFICIARY ACCOUNT NUMBER</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            maxlength="16"
                            name="beneficiaryAccountNumber[]"
                            v-model="transaction.beneficiaryAccountNumber"
                          />
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >CREDITOR/BENEFICIARY BANK BIC</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            name="beneficiaryBIC[]"
                            v-model="transaction.beneficiaryBIC"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >RFI REFERENCE NUMBER</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            maxlength="16"
                            name="rfiReferenceNumber[]"
                            v-model="transaction.rfiReferenceNumber"
                          />
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >OFI CUSTOMER REFERENCE NUMBER</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            maxlength="16"
                            name="ofiCustomerReferenceNumber[]"
                            v-model="transaction.ofiCustomerReferenceNumber"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >RFI CUSTOMER REFERENCE NUMBER</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            maxlength="16"
                            name="rfiCustomerReferenceNumber[]"
                            v-model="transaction.rfiCustomerReferenceNumber"
                          />
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label">INSTRUCTIONS</label>
                          <textarea
                            class="form-control"
                            name="instructions[]"
                            rows="3"
                            maxlength="163"
                            v-model="transaction.instructions"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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
        @click.prevent="addTransaction(true)"
      >
        ADD TRANSACTION
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
import moment from "moment";

export default {
  components: {
    appLoader: Loader,
  },

  props: ["modalStatus"],

  data() {
    return {
      isLoading: 0,
      view: "description",
      bicOfBank: "",
      transactions: [],
      output: "",
      status: "",
      table: [
        {
          tab: 0,
          elementName: "outward_message",
          description: "Outward message element",
        },
        {
          tab: 1,
          elementName: "seq",
          description: "Sequence number",
        },
        {
          tab: 1,
          elementName: "transaction_count",
          description: "Transaction count",
        },
        {
          tab: 1,
          elementName: "currency",
          description: "Currency",
        },
        {
          tab: 1,
          elementName: "amount",
          description: "Amount",
        },
        {
          tab: 1,
          elementName: "received_date",
          description: "Received date",
        },
        {
          tab: 1,
          elementName: "status",
          description: "Status",
        },
      ],
    };
  },

  watch: {
    modalStatus: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal == 0) this.resetData();
      },
    },
  },

  methods: {
    setValue(e, key, index) {
      this.transactions[index][key] = e.target.value;
    },

    resetData() {
      this.view = "description";
      this.output = "";
      this.bicOfBank = "";
      this.transactions = [];
      this.addTransaction();
    },

    goBack() {
      this.resetData();
    },

    getTabs(count) {
      return `${+count * 30}px`;
    },

    async submit() {
      const valid = $(".send-outward-message").valid();

      if (!valid) return;

      this.view = "output";
      this.isLoading = 1;

      const payload = {
        bicOfBank: this.bicOfBank,
        transactions: this.transactions,
      };

      const { status, data, responseStatus } = await this.$store.dispatch(
        "api/sendOutwardMessage",
        payload
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

    removeTransaction(index) {
      this.transactions.splice(index, 1);

      const count = this.transactions.length;

      this.$nextTick(() => {
        $(`#collapse${count - 1}`).collapse("show");
        this.initValidation();
      });
    },

    addTransaction(validate = false) {
      if (validate) {
        const valid = $(".send-outward-message").valid();

        if (!valid) {
          this.$popover({
            icon: "fas fa-exclamation-triangle",
            title: "Warning!",
            content: `Please fill up all required fields before adding a new transaction!`,
            buttons: {
              ok: {
                text: "ok",
                btnClass: "btn-success",
                keys: ["enter"],
              },
            },
          });

          return;
        }
      }

      this.transactions.push(this.injectData());

      const count = this.transactions.length;

      this.$nextTick(() => {
        $(`#collapse${count - 1}`).collapse("show");
        this.initValidation();
      });
    },

    initValidation() {
      $(".money").mask("#,##0.00", { reverse: true });

      $(".send-outward-message").validate({
        rules: {
          bicOfBank: {
            required: true,
          },
          "ofiReferenceNumber[]": {
            required: true,
          },
          "amount[]": {
            required: true,
          },
          "remitterName[]": {
            required: true,
          },
          "remitterAddress[]": {
            required: true,
          },
          "remitterAccountNumber[]": {
            required: true,
          },
          "remitterBIC[]": {
            required: true,
          },
          "beneficiaryName[]": {
            required: true,
          },
          "beneficiaryAccountNumber[]": {
            required: true,
          },
          "beneficiaryBIC[]": {
            required: true,
          },
          "instructions[]": {
            required: true,
          },
        },
        errorClass: "jv-error",
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

    injectData() {
      return {
        ofiReferenceNumber: "",
        amount: "",
        remitterName: "",
        remitterAddress: "",
        remitterAccountNumber: "",
        remitterBIC: "",
        beneficiaryName: "",
        beneficiaryAddress: "",
        beneficiaryAccountNumber: "",
        beneficiaryBIC: "",
        rfiReferenceNumber: "",
        ofiCustomerReferenceNumber: "",
        rfiCustomerReferenceNumber: "",
        instructions: "",
      };
    },
  },

  mounted() {
    this.$nextTick(() => {
      $("#collapse0").collapse("show");
    });
  },

  created() {
    this.addTransaction();
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

textarea {
  height: auto !important;
}
</style>
