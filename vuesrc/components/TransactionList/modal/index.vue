<template>
  <div
    class="modal fade"
    id="transaction-modal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="transaction-modal"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable mw-100"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title" id="modal-title-default">
            <b class="modal-title-section mr-2"> {{ getTitle }}</b>
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

          <div class="row">
            <div class="col-md-12">
              <h2>TRANSACTION DETAILS</h2>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-control-label">SEQUENCE NUMBER</label>
                <input
                  type="text"
                  class="form-control"
                  :value="reference.sequenceNumber"
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
                  :value="reference.settlementDate"
                  readonly="true"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-control-label">TYPE</label>
                <input
                  type="text"
                  class="form-control"
                  :value="reference.type"
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
                <label class="form-control-label">OFI REFERENCE NUMBER</label>
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
                <label class="form-control-label">RFI REFERENCE NUMBER</label>
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
                <label class="form-control-label">DEBTOR/REMITTER NAME</label>
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
                <label class="form-control-label">BIC OF DEBTOR/REMITTER</label>
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
              <h2
                v-if="
                  (reference.type == 'INWARD' && transaction.sent) ||
                    (reference.type == 'OUTWARD' && transaction.status && transaction.status != 'PROCESSING...')
                "
                class="text-info"
              >
                STATUS AND REMARKS
              </h2>
            </div>
          </div>

          <div
            class="row"
            v-if="reference.type == 'INWARD' && transaction.sent"
          >
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-control-label">STATUS</label>
                <input
                  type="text"
                  class="form-control"
                  :value="transaction.status == 0 ? '' : transaction.status"
                  readonly="true"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="form-control-label">REMARKS/NARRATIVE</label>
                <textarea
                  class="form-control"
                  rows="3"
                  maxlength="163"
                  v-model="transaction.remarks"
                  readonly="true"
                />
              </div>
            </div>
          </div>

          <div
            class="row"
            v-if="reference.type == 'OUTWARD' && transaction.status && transaction.status != 'PROCESSING...'"
          >
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-control-label">ACCEPTANCE DATE</label>
                <input
                  type="text"
                  class="form-control"
                  :value="parseTimestamp(transaction.acceptanceDate)"
                  readonly="true"
                />
              </div>
            </div>
          </div>

          <div
            class="row"
            v-if="reference.type == 'OUTWARD' && transaction.status && transaction.status != 'PROCESSING...'"
          >
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-control-label">STATUS</label>
                <input
                  type="text"
                  class="form-control"
                  :value="transaction.status"
                  readonly="true"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="form-control-label">REMARKS/NARRATIVE</label>
                <textarea
                  class="form-control"
                  rows="3"
                  maxlength="163"
                  v-model="transaction.remarks"
                  readonly="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "../../master/Loader";
import moment from "moment";

export default {
  components: {
    appLoader: Loader,
  },

  data() {
    return {
      isLoading: 1,
      transaction: {},
      transactionReference: {},
    };
  },

  props: ["viewTransactionModal", "reference"],

  computed: {
    getTitle() {
      return `${this.transactionReference.type} - ${this.transactionReference.sequenceNumber}`;
    },
  },

  watch: {
    async viewTransactionModal(newVal, oldVal) {
      if (newVal == 1) {
        this.transactionReference = this.reference;

        $("#transaction-modal").modal({
          backdrop: "static",
        });

        await this.getTransaction();
      }
    },
  },

  methods: {
    closeModal() {
      $("#transaction-modal").modal("hide");
      this.$emit("update:viewTransactionModal", 0);
    },

    parseTimestamp(time) {
      return moment(time).isValid()
        ? moment(time).format("MMMM D, YYYY - h:mm:ss A")
        : "";
    },

    parseAmount(amount) {
      const amt = `${amount}`.replace(/,/g, "");

      return (+amt).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    },

    async getTransaction() {
      this.isLoading = 1;

      const { data, status } = await this.$store.dispatch(
        "transactionlist/getTransaction",
        {
          referenceId: this.transactionReference.referenceId,
        }
      );

      this.transaction = data || {};

      this.isLoading = 0;
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

#transaction-modal .modal-dialog {
  width: 95%;
}

textarea {
  height: auto !important;
}
</style>
