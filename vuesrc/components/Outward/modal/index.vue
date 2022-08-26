<template>
  <div
    class="modal fade"
    id="outward-modal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="outward-modal"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable mw-100"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title" id="modal-title-default">
            <b class="modal-title-section mr-2"
              >OUTWARD MESSAGE {{ getSequenceNumber }}</b
            >
            <i class="far fa-file-pdf pdf-view-button" @click="viewPDF"></i>
          </h6>
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click.prevent="closeModal"
          >
            <span aria-hidden="true" class="close-icon">×</span>
          </button>
        </div>

        <div class="modal-body">
          <app-loader v-if="isLoading" />

          <form class="outward-message" v-if="!isLoading">
            <div class="row" v-if="outwardReference.status == -2">
              <div class="col-md-12">
                <h2>REJECT DETAILS</h2>
              </div>
            </div>

            <div class="row" v-if="outwardReference.status == -2">
              <div class="col-md-12">
                <div class="form-group">
                  <label class="form-control-label">REMARKS</label>
                  <textarea
                    class="form-control"
                    rows="6"
                    v-model="outwardReference.remarks"
                    readonly="true"
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <h2>GROUP HEADER</h2>
              </div>
            </div>

            <div class="row" v-if="outwardReference.status >= 1">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-control-label">OUTWARD MESSAGE ID</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="outwardReference.sequenceNumber"
                    readonly="true"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-control-label">SETTLEMENT DATE</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="outwardReference.settlementDate"
                    readonly="true"
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-control-label"
                    >NUMBER OF TRANSACTION/S</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    :value="getTotalTransactions"
                    readonly="true"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-control-label">TOTAL AMOUNT</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="getTotalAmount"
                    readonly="true"
                  />
                </div>
              </div>
            </div>

            <div class="row" v-if="outwardReference.status > 1">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-control-label">STATUS CODE</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="outwardMessage.groupStatus"
                    readonly="true"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-control-label">STATUS DESCRIPTION</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="outwardMessage.groupStatusDescription"
                    readonly="true"
                  />
                </div>
              </div>
            </div>

            <div class="row mt-4">
              <div class="col-md-12">
                <h2 v-if="outwardReference.status <= 1">
                  TRANSACTION INFORMATION
                </h2>
                <h2 v-if="outwardReference.status > 1">
                  TRANSACTION INFORMATION AND STATUS
                </h2>
              </div>
            </div>

            <div class="accordion" id="transactionAccordion">
              <div
                class="card mb-0"
                v-for="(transaction, index) in outwardMessage.transactions"
                :key="index"
              >
                <div
                  class="card-header text-white"
                  :class="{
                    'bg-info': !transaction.hasStatus,
                    'bg-success': transaction.hasStatus,
                  }"
                  :id="`heading${index}`"
                  data-toggle="collapse"
                  :data-target="`#collapse${index}`"
                  aria-expanded="false"
                  :aria-controls="`collapse${index}`"
                >
                  <div class="row">
                    <div class="col-md-6">
                      <h3
                        class="mb-0 mr-1 text-danger same-line"
                        v-if="transaction.sent"
                      >
                        SENT
                      </h3>

                      <h3 class="mb-0 text-white same-line">
                        #{{
                          outwardReference.status > 1
                            ? transaction.endToEndId
                            : index + 1
                        }}
                        - {{ transaction.ofiReferenceNumber }} -
                        {{ checkAmount(transaction.amount) ? "" : "PHP" }}
                        {{ parseAmount(transaction.amount) }}
                      </h3>
                    </div>
                    <div class="col-md-6 text-right pr-5">
                      <h3 class="mb-0 text-white" v-if="transaction.hasStatus">
                        {{ transaction.status }}
                      </h3>
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
                    <div
                      class="row"
                      v-if="outwardReference.status > 1"
                    >
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >ORIGINAL ID/SEQUENCE NUMBER OF TRANSACTION</label
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
                          <label class="form-control-label"
                            >TRANSACTION STATUS</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            :value="transaction.status"
                            readonly="true"
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      class="row"
                      v-if="outwardReference.status > 1"
                    >
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >ACCEPTANCE DATE/TIME</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            :value="
                              outwardReference.status > 2
                                ? parseTimestamp(transaction.acceptanceDate)
                                : transaction.acceptanceDate
                            "
                            readonly="true"
                          />
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >REMARKS/NARRATIVE</label
                          >
                          <textarea
                            class="form-control"
                            rows="3"
                            maxlength="163"
                            :value="transaction.remarks"
                            readonly="true"
                          />
                        </div>
                      </div>
                    </div>

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
                            maxlength="16"
                            name="ofiCustomerReferenceNumber[]"
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
                            maxlength="16"
                            name="rfiReferenceNumber[]"
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
                            maxlength="16"
                            name="rfiCustomerReferenceNumber[]"
                            :value="transaction.rfiCustomerReferenceNumber"
                            readonly="true"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label">AMOUNT</label>
                          <input
                            type="text"
                            class="form-control money"
                            name="amount[]"
                            :value="parseAmount(transaction.amount)"
                            readonly="true"
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
                            :value="transaction.instructions"
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
                            maxlength="50"
                            name="remitterName[]"
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
                            name="remitterAddress[]"
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
                            >DEBTOR/REMITTER ACCOUNT NUMBER</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            maxlength="16"
                            name="remitterAccountNumber[]"
                            :value="transaction.remitterAccountNumber"
                            readonly="true"
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
                            maxlength="50"
                            name="beneficiaryName[]"
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
                            name="beneficiaryAddress[]"
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
                            >CREDITOR/BENEFICIARY ACCOUNT NUMBER</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            maxlength="16"
                            name="beneficiaryAccountNumber[]"
                            :value="transaction.beneficiaryAccountNumber"
                            readonly="true"
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
                            :value="transaction.beneficiaryBIC"
                            readonly="true"
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

        <div class="modal-footer" v-if="isLoading == 0">
          <button
            type="button"
            class="btn btn-danger"
            @click.prevent="rejectOutwardMessage"
            v-if="outwardReference.status == 0 && session.roleId == 3"
          >
            REJECT
          </button>

          <button
            type="button"
            class="btn btn-success"
            @click.prevent="sendOutwardMessage"
            v-if="outwardReference.status == 0 && session.roleId == 3"
          >
            APPROVE AND SEND
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "../../master/Loader";
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  components: {
    appLoader: Loader,
  },

  data() {
    return {
      isLoading: 1,
      outwardMessage: {},
      statusLists: [],
      outwardReference: {},
    };
  },

  props: ["viewOutwardModal", "reference"],

  watch: {
    async viewOutwardModal(newVal, oldVal) {
      if (newVal == 1) {
        this.outwardReference = this.reference;

        $("#outward-modal").modal({
          backdrop: "static",
        });

        await this.getTransaction();

        if (this.outwardReference.status == 1) {
          this.$nextTick(() => {
            $("#collapse0").collapse("show");
          });
        } else this.isLoading = 0;
      }
    },
  },

  computed: {
    ...mapGetters({
      session: "getSession",
      apiBaseUrl: "getApiBaseUrl",
    }),

    getTotalTransactions() {
      return this.outwardMessage.transactions.length;
    },

    getTotalAmount() {
      let total = 0;

      this.outwardMessage.transactions.forEach((data) => {
        const amt = data.amount.replace(/,/g, "");
        total += +amt;
      });

      return this.parseAmount(total);
    },

    getSequenceNumber() {
      return this.outwardReference.sequenceNumber
        ? ` - ${this.outwardReference.sequenceNumber}`
        : "";
    },
  },

  methods: {
    async viewPDF() {
      const vm = this;

      this.$popover({
        icon: "fas fa-circle-notch fa-pulse",
        title: "GENERATING LINK...",
        content: "",
        onOpenBefore: function() {
          $(this.$contentPane).remove();
        },
        onContentReady: function() {
          vm.$store
            .dispatch("outward/generatePDF", {
              referenceId: vm.outwardReference.referenceId,
            })
            .then((res) => {
              const { status, data } = res;

              window.open(`${vm.apiBaseUrl}/PDF/viewPDF/${data.link}`, "_blank");
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

    parseTimestamp(time) {
      return moment(time, "x").isValid()
        ? moment(time, "x").format("MMMM D, YYYY - h:mm:ss A")
        : time;
    },

    closeModal() {
      $("#outward-modal").modal("hide");
      this.$emit("update:viewOutwardModal", 0);
    },

    checkAmount(amount) {
      const amt = `${amount}`.replace(/,/g, "");

      return +amt == 0;
    },

    parseAmount(amount) {
      const amt = `${amount}`.replace(/,/g, "");

      return +amt == 0
        ? "PROCESSING..."
        : (+amt).toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          });
    },

    async getTransaction() {
      this.isLoading = 1;

      const { data, status } = await this.$store.dispatch(
        "outward/getTransactions",
        {
          referenceId: this.outwardReference.referenceId,
        }
      );

      this.outwardMessage = data || {};

      this.isLoading = 0;
    },

    rejectTemplate(errorContent = "") {
      return `<div class="container">  
                        ${errorContent}
                        <div class="row">
                          <div class="col">
                            <div class="form-group">
                              <label class="form-control-label">REMARKS</label>
                              <textarea
                                class="form-control textarea_auto"
                                name="reject_remarks"
                                rows="15"
                              />
                            </div>
                          </div>
                        </div>
                       </div>
                      `;
    },

    async rejectOutwardMessage() {
      const vm = this;

      this.$popover({
        icon: "far fa-question-circle",
        title: "REJECT",
        content: vm.rejectTemplate(),
        columnClass: "col-md-10",
        onContentReady: function() {
          this.$content.find("textarea[name='reject_remarks']").focus();
        },
        buttons: {
          submit: {
            text: "submit",
            btnClass: "btn-success",
            keys: ["enter"],
            action() {
              let JCinstance = this;
              const remarks = JCinstance.$content
                .find("textarea[name='reject_remarks']")
                .val();

              JCinstance.$$submit.hide();
              JCinstance.$$cancel.hide();
              JCinstance.setContent("Processing....");
              JCinstance.setIcon("fas fa-circle-notch fa-pulse");

              const payload = {
                referenceId: vm.outwardReference.referenceId,
                remarks,
              };

              vm.$store.dispatch("outward/reject", payload).then((res) => {
                const { status, message, errors, data } = res;

                JCinstance.setIcon(
                  status == 200
                    ? "far fa-check-circle"
                    : "fas fa-exclamation-triangle"
                );

                if (status == 200) {
                  JCinstance.setContent(message);
                  JCinstance.$$close.show();
                } else {
                  const errorContent = `<div class="row mb-3">
                                    <div class="col">
                                      <b class="text-danger">${message}</b> <br /> ${
                    errors ? errors.join("<br />") : ""
                  }</b>
                                    </div>
                                  </div>
                                 `;

                  JCinstance.setContent(vm.rejectTemplate(errorContent));
                  JCinstance.$$submit.show();
                  JCinstance.$$cancel.show();
                }
              });

              return false;
            },
          },
          cancel: {
            text: "Cancel",
            btnClass: "btn-danger",
          },
          close: {
            text: "Close",
            btnClass: "btn-danger",
            isHidden: true,
          },
        },
      });
    },

    async sendOutwardMessage() {
      const vm = this;

      let payload = {
        referenceId: this.outwardReference.referenceId,
      };
      // console.log("ditomuna")
      // return

      this.$popover({
        icon: "far fa-question-circle",
        title: "APPROVE AND SEND",
        content: "",
        buttons: {
          submit: {
            text: "submit",
            btnClass: "btn-success",
            keys: ["enter"],
            action() {
              let JCinstance = this;

              JCinstance.$$submit.hide();
              JCinstance.$$cancel.hide();

              JCinstance.setContent("Processing....");
              JCinstance.setIcon("fas fa-circle-notch fa-pulse");
              console.log(payload,"payload, index.vue")
              // return
              vm.$store
                .dispatch("outward/sendOutwardMessage", payload)
                .then((res) => {
                  const { status, message, errors, data } = res;

                  JCinstance.setIcon(
                    status == 200
                      ? "far fa-check-circle"
                      : "fas fa-exclamation-triangle"
                  );

                  JCinstance.setContent(
                    status == 200
                      ? message
                      : `<b>${message}</b> <br /> ${
                          errors ? errors.join("<br />") : ""
                        }`
                  );

                  if (status == 200) {
                    JCinstance.$$close.show();
                  } else {
                    JCinstance.$$submit.show();
                    JCinstance.$$cancel.show();
                  }
                });

              return false;
            },
          },
          cancel: {
            text: "Cancel",
            btnClass: "btn-danger",
          },
          close: {
            text: "Close",
            btnClass: "btn-info",
            isHidden: true,
          },
        },
      });
    },
  },

  created() {
    this.sockets.subscribe("OutwardSave", async ({ data }) => {
      if (this.outwardReference?.referenceId == data.referenceId) {
        this.outwardReference = data || {};
        const { data: txnData, status } = await this.$store.dispatch(
          "outward/getTransactions",
          {
            referenceId: data.referenceId,
          }
        );

        this.outwardMessage = txnData || {};
      }
    });
  },
};
</script>

<style scoped>
b.modal-title-section {
  font-size: 25px;
}

#outward-modal .modal-dialog {
  width: 95%;
}

textarea {
  height: auto !important;
}

.pdf-view-button {
  font-size: 25px;
  color: #f5365c !important;
  cursor: pointer;
}

.same-line {
  display: inline-block;
}
</style>
</style>
