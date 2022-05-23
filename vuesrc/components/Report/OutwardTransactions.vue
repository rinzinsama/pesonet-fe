<template>
  <div class="card mb-4">
    <div class="card-header">
      <button type="button" class="btn btn-warning" @click="goBack">
        BACK
      </button>
    </div>
    <div class="card-body">
      <form class="outward-transactions-report-form">
        <div class="row">
          <div class="col-md-4">
            <div class="input-group input-group-alternative input-group-merge">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i class="far fa-calendar-alt"></i
                ></span>
              </div>
              <input
                class="form-control"
                type="text"
                name="date"
                :value="date"
                readonly="true"
              />
            </div>
          </div>
          <div class="col-md-4">
            <button
              type="button"
              class="btn btn-success"
              @click="generateData"
              :disabled="isDisabled"
            >
              GENERATE
            </button>
          </div>
          <div
            class="col-md-4 text-right"
            v-if="isLoading == 0 && transactions.length > 0"
          >
            <button
              type="button"
              class="btn btn-danger"
              @click="generatePDFTable"
              :disabled="isDisabled"
            >
              PDF (TABLE)
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="generatePDF"
              :disabled="isDisabled"
            >
              PDF (ALL DATA)
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="generateXLSX"
              :disabled="isDisabled"
            >
              XLSX
            </button>
          </div>
        </div>

        <div v-if="isLoading == 1">
          <div class="row">
            <div class="col-md-12 pt-3 pb-3">
              <app-loader />
            </div>
          </div>
        </div>

        <div
          v-if="transactions.length == 0 && isLoading == 0 && isTriggered == 1"
        >
          <div class="row">
            <div class="col-md-12 text-center no-data-found">
              <h1>No data found.</h1>
            </div>
          </div>
        </div>

        <div class="mt-4" v-if="isLoading == 0 && transactions.length > 0">
          <div class="row">
            <div class="col">
              <h1>OUTWARD TRANSACTIONS - {{ date }}</h1>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <h1>NUMBER OF TRANSACTIONS: {{ transactions.length }}</h1>
            </div>
            <div class="col-md-6 text-right">
              <h1>TOTAL AMOUNT: {{ getTotalAmount }}</h1>
            </div>
          </div>
          <div class="accordion mt-2" id="reportOutwardTransactionAccordion">
            <div
              class="card mb-0"
              v-for="(transaction, index) in transactions"
              :key="index"
            >
              <div
                class="card-header  text-white bg-info"
                :id="`heading${index}`"
                data-toggle="collapse"
                :data-target="`#collapse${index}`"
                aria-expanded="false"
                :aria-controls="`collapse${index}`"
              >
                <div class="row">
                  <div class="col-md-6">
                    <h3 class="mb-0 text-white same-line">
                      {{ transaction.sequenceNumber }}
                      -
                      {{ transaction.ofiReferenceNumber }}
                      - PHP {{ parseAmount(transaction.amount) }}
                    </h3>
                  </div>
                  <div class="col-md-6 text-right pr-5">
                    <h3 class="mb-0 text-white">
                      {{
                        transaction.status &&
                        transaction.status != "PROCESSING..."
                          ? transaction.status
                          : "RECEIVED BY RFI"
                      }}
                    </h3>
                  </div>
                </div>
              </div>

              <div
                :id="`collapse${index}`"
                class="collapse"
                :aria-labelledby="`heading${index}`"
                data-parent="#reportOutwardTransactionAccordion"
              >
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-12">
                      <h3>TRANSACTION DETAILS</h3>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label"
                          >SEQUENCE NUMBER</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          :value="transaction.sequenceNumber"
                          readonly="true"
                        />
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label"
                          >SETTLEMENT DATE</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          :value="transaction.settlementDate"
                          readonly="true"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label"
                          >PAYMENT ID/SEQUENCE NUMBER</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          :value="transaction.endToEndId"
                          readonly="true"
                        />
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label">AMOUNT</label>
                        <input
                          type="text"
                          class="form-control"
                          :value="parseAmount(transaction.amount)"
                          readonly="true"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row mt-3">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label"
                          >OFI REFERENCE NUMBER</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          :value="transaction.ofiReferenceNumber"
                          readonly="true"
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
                          :value="transaction.ofiCustomerReferenceNumber"
                          readonly="true"
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
                          :value="transaction.rfiReferenceNumber"
                          readonly="true"
                        />
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label"
                          >RFI CUSTOMER REFERENCE NUMBER</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          :value="transaction.rfiCustomerReferenceNumber"
                          readonly="true"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label class="form-control-label">INSTRUCTIONS</label>
                        <textarea
                          class="form-control"
                          rows="3"
                          maxlength="163"
                          v-model="transaction.instructions"
                          readonly="true"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row mt-2">
                    <div class="col-md-12">
                      <h2 class="text-info">DEBTOR/REMITTER</h2>
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
                          :value="transaction.remitterName"
                          readonly="true"
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
                          :value="transaction.remitterAddress"
                          readonly="true"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label"
                          >DEBTOR/REMITTER ACCOUNT NUMBER
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          :value="transaction.remitterAccountNumber"
                          readonly="true"
                        />
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label"
                          >BIC OF DEBTOR/REMITTER</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          :value="transaction.remitterBIC"
                          readonly="true"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row mt-2">
                    <div class="col-md-12">
                      <h2 class="text-info">CREDITOR/BENEFICIARY</h2>
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
                          :value="transaction.beneficiaryName"
                          readonly="true"
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
                          :value="transaction.beneficiaryAddress"
                          readonly="true"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label"
                          >CREDITOR/BENEFICIARY ACCOUNT NUMBER
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          :value="transaction.beneficiaryAccountNumber"
                          readonly="true"
                        />
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label"
                          >BIC OF CREDITOR/BENEFICIARY</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          :value="transaction.beneficiaryBIC"
                          readonly="true"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row mt-2">
                    <div class="col-md-12">
                      <h2 class="text-info">
                        STATUS AND REMARKS
                      </h2>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label">STATUS</label>
                        <input
                          type="text"
                          class="form-control"
                          :value="
                            transaction.status &&
                            transaction.status != 'PROCESSING...'
                              ? transaction.status
                              : 'RECEIVED BY RFI'
                          "
                          readonly="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Loader from "../master/Loader";
import { saveAs } from "file-saver";
import { mapGetters } from "vuex";

export default {
  components: {
    appLoader: Loader,
  },

  data() {
    return {
      isTriggered: 0,
      isLoading: 0,
      date: "",
      transactions: [],
    };
  },

  computed: {
    isDisabled() {
      return this.isLoading ? true : false;
    },

    ...mapGetters({
      apiBaseUrl: "getApiBaseUrl",
    }),

    getTotalAmount() {
      let total = 0;

      this.transactions.forEach((txn) => {
        const amt = `${txn.amount}`.replace(/,/g, "");

        total += +amt || 0;
      });

      return this.parseAmount(total);
    },
  },

  methods: {
    goBack() {
      this.$router.push({ name: "Report" });
    },

    parseTimestamp(time) {
      return moment(time, "x").format("MMMM D, YYYY - h:mm:ss A");
    },

    parseAmount(amount) {
      const amt = `${amount}`.replace(/,/g, "");

      return (+amt).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    },

    async generateData() {
      if (this.date.length == 0) {
        this.$popover({
          icon: "fas fa-exclamation-triangle",
          title: "Warning!",
          content: `Please select a date!`,
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

      this.isLoading = 1;

      const {
        data,
      } = await this.$store.dispatch(
        "report/generateOutwardTransactionReport",
        { date: moment(this.date, "MMMM D, YYYY").format("YYYY-MM-DD") }
      );

      this.transactions = data || [];

      this.isTriggered = 1;
      this.isLoading = 0;
    },

    async generateXLSX() {
      const vm = this;

      this.$popover({
        icon: "fas fa-circle-notch fa-pulse",
        title: "GENERATING XLSX...",
        content: "",
        onOpenBefore: function() {
          $(this.$contentPane).remove();
        },
        onContentReady: function() {
          vm.$store
            .dispatch("report/generateTransactionXLSX", {
              transactions: vm.transactions,
              type: "outward",
            })
            .then((res) => {
              const reportDate = moment(vm.date, "MMMM DD, YYYY").format(
                "YYYY-MM-DD"
              );

              if (res instanceof Blob) {
                saveAs(res, `Outward Report (${reportDate}).xlsx`);
                this.close();
              } else
                this.$popover({
                  icon: "fas fa-exclamation-triangle",
                  title: "Warning!",
                  content: `Cannot download file!`,
                  buttons: {
                    ok: {
                      text: "ok",
                      btnClass: "btn-success",
                      keys: ["enter"],
                    },
                  },
                });
            });
        },
        buttons: {
          ok: {
            isHidden: true,
          },
        },
      });
    },

    async generatePDFTable() {
      const vm = this;

      this.$popover({
        icon: "fas fa-circle-notch fa-pulse",
        title: "GENERATING PDF...",
        content: "",
        onOpenBefore: function() {
          $(this.$contentPane).remove();
        },
        onContentReady: function() {
          vm.$store
            .dispatch("report/generateTransactionPDFTable", {
              transactions: vm.transactions,
              type: "outward",
            })
            .then((res) => {
              const { status, data } = res;

              window.open(
                `${vm.apiBaseUrl}/PDF/viewPDF/${data.link}`,
                "_blank"
              );
              this.close();
            });
        },
        buttons: {
          ok: {
            isHidden: true,
          },
        },
      });
    },

    async generatePDF() {
      const vm = this;

      this.$popover({
        icon: "fas fa-circle-notch fa-pulse",
        title: "GENERATING PDF...",
        content: "",
        onOpenBefore: function() {
          $(this.$contentPane).remove();
        },
        onContentReady: function() {
          vm.$store
            .dispatch("report/generateTransactionPDF", {
              transactions: vm.transactions,
              type: "outward",
            })
            .then((res) => {
              const { status, data } = res;

              window.open(
                `${vm.apiBaseUrl}/PDF/viewPDF/${data.link}`,
                "_blank"
              );
              this.close();
            });
        },
        buttons: {
          ok: {
            isHidden: true,
          },
        },
      });
    },
  },

  mounted() {
    const vm = this;

    $("input[name='date']").datepicker({
      autoClose: true,
      language: "en",
      toggleSelected: false,
      dateFormat: "MM d, yyyy",
      onSelect: async function(fd, d, picker) {
        vm.date = fd;

        if (vm.firstLoad == 0) await vm.searchOutwardBatch();
      },
    });
  },
};
</script>
