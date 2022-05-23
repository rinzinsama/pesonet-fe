<template>
  <div
    class="modal fade"
    id="inward-modal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="inward-modal"
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
              >INWARD MESSAGE - {{ inwardReference.sequenceNumber }}</b
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

          <form class="inward-message" v-if="!isLoading">
            <div
              class="row"
              v-if="
                inwardReference.status == -3 || inwardReference.status == -2
              "
            >
              <div class="col-md-12">
                <h2>FAILED/REJECT DETAILS</h2>
              </div>
            </div>

            <div
              class="row"
              v-if="
                inwardReference.status == -3 || inwardReference.status == -2
              "
            >
              <div class="col-md-12">
                <div class="form-group">
                  <label class="form-control-label">REMARKS</label>
                  <textarea
                    class="form-control"
                    rows="6"
                    v-model="inwardReference.remarks"
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

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-control-label">BATCH ID</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="inwardMessage.GrpHdr.MsgId"
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
                    :value="parseDate(inwardMessage.GrpHdr.IntrBkSttlmDt)"
                    readonly="true"
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-control-label">CURRENCY</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="inwardMessage.GrpHdr.TtlIntrBkSttlmAmt.Ccy"
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
                    :value="
                      parseAmount(inwardMessage.GrpHdr.TtlIntrBkSttlmAmt.value)
                    "
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
                    :value="inwardMessage.GrpHdr.NbOfTxs"
                    readonly="true"
                  />
                </div>
              </div>
            </div>

            <div class="row mt-4">
              <div class="col-md-12">
                <h2>
                  CREDIT TRANSFER TRANSACTION INFORMATION
                  <span class="stats-counter" v-if="sentCount > 0">
                    (
                    <span class="text-success">{{ sentCount }} - SENT</span>
                    |
                    <span class="text-warning"
                      >{{ pendingCount }} - PENDING</span
                    >
                    )
                  </span>
                </h2>
              </div>
            </div>

            <div class="accordion" id="transactionAccordion">
              <div
                class="card mb-0"
                v-for="(transaction, index) in inwardMessage.CdtTrfTxInf"
                :key="index"
              >
                <div
                  class="card-header text-white"
                  :class="
                    inwardReference.status == 0 && transaction.status == 0
                      ? 'bg-info'
                      : 'bg-success'
                  "
                  :id="`heading${index}`"
                  data-toggle="collapse"
                  :data-target="`#collapse${index}`"
                  aria-expanded="false"
                  :aria-controls="`collapse${index}`"
                >
                  <div class="row">
                    <div class="col-md-6">
                      <div
                        class="custom-control custom-control-alternative custom-checkbox mr-1 same-line"
                        v-if="
                          ([0, -2, -3].includes(inwardReference.status) &&
                            session.roleId == 2 &&
                            !transaction.sentStatus) ||
                            ([1, 2].includes(inwardReference.status) &&
                              session.roleId == 3 &&
                              !transaction.sentStatus)
                        "
                      >
                        <input
                          class="custom-control-input transaction-checkbox"
                          :id="`checkbox-${index}`"
                          type="checkbox"
                        />
                        <label
                          class="custom-control-label"
                          :for="`checkbox-${index}`"
                          @click.stop.prevent="toggleCheckbox(index)"
                        ></label>
                      </div>

                      <h3
                        class="mb-0 text-danger same-line"
                        v-if="transaction.sentStatus"
                      >
                        SENT
                      </h3>

                      <h3 class="mb-0 text-white same-line">
                        #{{ transaction.PmtId.EndToEndId }} -
                        {{ transaction.PmtId.TxId }} -
                        {{ transaction.IntrBkSttlmAmt.Ccy }}
                        {{ parseAmount(transaction.IntrBkSttlmAmt.value) }}
                      </h3>
                    </div>
                    <div class="col-md-6 text-right pr-5">
                      <h3
                        class="mb-0 text-white"
                        v-if="`${transaction.status}` != '0'"
                      >
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
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >PAYMENT ID/SEQUENCE NUMBER</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            :value="transaction.PmtId.EndToEndId"
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
                            :value="transaction.PmtId.TxId"
                            readonly="true"
                          />
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >RFI REFERENCE NUMBER</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            :value="
                              transaction.RmtInf.Ustrd.rfi_reference_number
                            "
                            readonly="true"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >OFI CUSTOMER REFERENCE NUMBER</label
                          >
                          <input
                            type="text"
                            class="form-control"
                            :value="
                              transaction.RmtInf.Ustrd
                                .ofi_customer_reference_number
                            "
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
                            :value="
                              transaction.RmtInf.Ustrd
                                .rfi_customer_reference_number
                            "
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
                            v-model="transaction.RmtInf.Ustrd.instructions"
                            readonly="true"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label">CURRENCY</label>
                          <input
                            type="text"
                            class="form-control"
                            :value="transaction.IntrBkSttlmAmt.Ccy"
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
                            :value="
                              parseAmount(transaction.IntrBkSttlmAmt.value)
                            "
                            readonly="true"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row mt-2">
                      <div class="col-md-12">
                        <h2>DEBTOR/REMITTER</h2>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >DEBTOR/REMITTER NAME
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            :value="transaction.Dbtr.Nm"
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
                            :value="parseAddress(transaction.Dbtr.PstlAdr)"
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
                            :value="transaction.DbtrAcct.Id.Othr.Id"
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
                            :value="transaction.DbtrAgt.FinInstnId.BICFI"
                            readonly="true"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row mt-2">
                      <div class="col-md-12">
                        <h2>CREDITOR/BENEFICIARY</h2>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >CREDITOR/BENEFICIARY NAME
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            :value="transaction.Cdtr.Nm"
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
                            :value="parseAddress(transaction.Cdtr.PstlAdr)"
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
                            :value="transaction.CdtrAcct.Id.Othr.Id"
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
                            :value="transaction.CdtrAgt.FinInstnId.BICFI"
                            readonly="true"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row mt-2">
                      <div class="col-md-12">
                        <h2
                          v-if="
                            [0, -2, -3].includes(inwardReference.status) &&
                              session.roleId == 2
                          "
                        >
                          SET STATUS
                        </h2>
                        <h2
                          v-if="
                            (![0, -2, -3].includes(inwardReference.status) &&
                              session.roleId == 2) ||
                              session.roleId == 3
                          "
                        >
                          STATUS AND REMARKS
                        </h2>
                      </div>
                    </div>

                    <div
                      class="row"
                      v-if="
                        [0, -2, -3].includes(inwardReference.status) &&
                          session.roleId == 2
                      "
                    >
                      <div class="col-md-6">
                        <div class="form-group focused">
                          <label class="form-control-label">STATUS</label>
                          <select
                            class="selectpicker"
                            data-size="5"
                            data-live-search="true"
                            data-style="btn-danger"
                            data-width="100%"
                            v-model="transaction.status"
                          >
                            <option value="0" hidden
                              >PLEASE SELECT STATUS</option
                            >
                            <option
                              v-for="(list, index) in statusLists"
                              :key="index"
                              :value="list.statusCode"
                              >({{ list.statusCode }})
                              {{ list.statusName }}</option
                            >
                          </select>
                        </div>
                      </div>

                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >REMARKS/NARRATIVE</label
                          >
                          <textarea
                            class="form-control customValidationOutwardDefaultForm"
                            rows="3"
                            maxlength="163"
                            v-model="transaction.remarks"
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      class="row"
                      v-if="
                        (![0, -2, -3].includes(inwardReference.status) &&
                          session.roleId == 2) ||
                          session.roleId == 3
                      "
                    >
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="form-control-label">STATUS</label>
                          <input
                            type="text"
                            class="form-control"
                            :value="
                              transaction.status == 0 ? '' : transaction.status
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
          </form>
        </div>

        <div class="modal-footer" v-if="isLoading == 0">
          <button
            type="button"
            class="btn btn-success px-3"
            v-if="
              !isFull &&
                (([0, -2, -3].includes(inwardReference.status) &&
                  session.roleId == 2) ||
                  ([1, 2].includes(inwardReference.status) &&
                    session.roleId == 3))
            "
            @click.prevent="checkAll()"
          >
            <i class="fas fa-check-double"></i>
          </button>

          <button
            type="button"
            class="btn btn-warning px-3"
            @click.prevent="removeAll()"
            v-if="
              isFull &&
                (([0, -2, -3].includes(inwardReference.status) &&
                  session.roleId == 2) ||
                  ([1, 2].includes(inwardReference.status) &&
                    session.roleId == 3))
            "
          >
            <i class="far fa-times-circle"></i>
          </button>

          <button
            type="button"
            class="btn btn-warning"
            @click.prevent="selectStatus()"
            :disabled="checkRack.length == 0"
            v-if="
              [0, -2, -3].includes(inwardReference.status) &&
                session.roleId == 2
            "
          >
            SELECT STATUS
            <span class="badge badge-primary">{{ checkRack.length }}</span>
          </button>

          <div class="btn-group mr-auto">
            <button
              type="button"
              class="btn btn-danger dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              DOWNLOAD
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" @click.prevent="downloadFile('inward')"
                >INWARD FILE</a
              >
              <a class="dropdown-item" @click.prevent="downloadFile('tgs')"
                >TGS</a
              >
              <a class="dropdown-item" @click.prevent="downloadFile('hotscan')"
                >HOTSCAN</a
              >
            </div>
          </div>

          <button
            type="button"
            class="btn btn-success"
            @click.prevent="updateStatus"
            v-if="
              [0, -2, -3].includes(inwardReference.status) &&
                session.roleId == 2
            "
          >
            UPDATE STATUS
          </button>

          <button
            type="button"
            class="btn btn-danger"
            @click.prevent="reject"
            v-if="
              [1, 2].includes(inwardReference.status) && session.roleId == 3
            "
          >
            REJECT
          </button>

          <button
            type="button"
            class="btn btn-success"
            @click.prevent="sendStatus"
            v-if="
              [1, 2].includes(inwardReference.status) && session.roleId == 3
            "
            :disabled="checkRack.length == 0"
          >
            APPROVE AND SEND
            <span class="badge badge-primary">{{ checkRack.length }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "../../master/Loader";
import moment from "moment";
import { saveAs } from "file-saver";
import { mapGetters } from "vuex";

export default {
  components: {
    appLoader: Loader,
  },

  data() {
    return {
      isLoading: 1,
      inwardMessage: {},
      statusLists: [],
      inwardReference: {},
      checkRack: [],
    };
  },

  props: ["viewInwardModal", "reference"],

  watch: {
    async viewInwardModal(newVal, oldVal) {
      if (newVal == 1) {
        this.checkRack = [];
        this.inwardReference = this.reference;
        $("#inward-modal").modal({
          backdrop: "static",
        });

        await this.getTransaction();
      }
    },

    inwardMessage(newVal) {
      this.$nextTick(() => {
        if ([0, -2, -3].includes(this.inwardReference.status))
          $(".selectpicker").selectpicker("refresh");

        $(".inward-message").validate({
          ignore: false,
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
      });
    },
  },

  computed: {
    isFull() {
      return this.inwardMessage.CdtTrfTxInf.length == this.checkRack.length;
    },

    ...mapGetters({
      session: "getSession",
      apiBaseUrl: "getApiBaseUrl",
    }),

    sentCount() {
      return this.inwardMessage.CdtTrfTxInf.filter((txn) => txn.sentStatus)
        .length;
    },

    pendingCount() {
      return this.inwardMessage.CdtTrfTxInf.filter((txn) => !txn.sentStatus)
        .length;
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
            .dispatch("inward/generatePDF", {
              referenceId: vm.inwardReference.referenceId,
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

    parseAddress(address) {
      return address.join("");
    },

    parseAmount(amount) {
      const amt = `${amount}`.replace(/,/g, "");

      return (+amt).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    },

    parseDate(date) {
      return moment(date, "YYYY-MM-DD").format("MMMM D, YYYY");
    },

    closeModal() {
      $("#inward-modal").modal("hide");
      this.$emit("update:viewInwardModal", 0);
    },

    async getTransaction() {
      this.isLoading = 1;

      const [
        { data: txnData, status: txnStatus },
        { data: dropdownData, status: dropdownStatus },
      ] = await Promise.all([
        await this.$store.dispatch("inward/getTransactions", {
          referenceId: this.inwardReference.referenceId,
        }),
        await this.$store.dispatch("statuslist/getListsActive"),
      ]);

      let inwardMessage = txnData ? txnData.FIToFICstmrCdtTrf : {};
      if (this.inwardReference.status == 0)
        inwardMessage.CdtTrfTxInf.forEach((data, index) => {
          inwardMessage.CdtTrfTxInf[index].status =
            this.session.roleId == 3 ? 0 : "DS07";
          inwardMessage.CdtTrfTxInf[index].remarks = "";
        });

      this.inwardMessage = inwardMessage;
      this.statusLists = dropdownData || [];

      this.isLoading = 0;
    },

    updateStatus() {
      const vm = this;

      const valid = $(".inward-message").valid();

      if (!valid) return;

      const filledUp = this.inwardMessage.CdtTrfTxInf.every(
        (data) => data.status != 0
      );

      if (filledUp) {
        const payload = {
          referenceId: this.reference.referenceId,
          inward: this.inwardMessage,
        };

        this.$popover({
          icon: "far fa-question-circle",
          title: "UPDATE STATUS",
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

                vm.$store
                  .dispatch("inward/updateStatus", payload)
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
                        : `<b>${message}</b> <br /> ${errors.join("<br />")}`
                    );

                    if (status == 200) JCinstance.$$close.show();
                    else {
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
      } else
        this.$popover({
          icon: "fas fa-exclamation-triangle",
          title: "Warning!",
          content: `Please set status to every transaction!`,
          buttons: {
            ok: {
              text: "ok",
              btnClass: "btn-success",
              keys: ["enter"],
            },
          },
        });
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

    async reject() {
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
                referenceId: vm.inwardReference.referenceId,
                remarks,
              };

              vm.$store.dispatch("inward/reject", payload).then((res) => {
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
                                      <b class="text-danger">${message}</b> <br /> ${errors.join(
                    "<br />"
                  )}</b>
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

    sendTemplate(errorMessage = "") {
      let forSubmissionRack = [];

      this.checkRack.forEach((chk) => {
        forSubmissionRack.push(
          `<div class="col-md-12"> 
            #${this.inwardMessage.CdtTrfTxInf[chk].PmtId.EndToEndId} - 
            ${this.inwardMessage.CdtTrfTxInf[chk].PmtId.TxId} - 
            ${this.inwardMessage.CdtTrfTxInf[chk].IntrBkSttlmAmt.Ccy} -
            ${this.parseAmount(
              this.inwardMessage.CdtTrfTxInf[chk].IntrBkSttlmAmt.value
            )}
          </div>`
        );
      });

      return `
      <div>
        ${
          errorMessage.length > 0
            ? `<b class="text-danger">${errorMessage}</b>`
            : ""
        }
        <h3>NUMBER OF TRANSACTIONS TO BE SUBMITTED: <span class="text-success">${
          this.checkRack.length
        }</span></h3>
        <h3>TRANSACTIONS:</h3>
        <div class="colored-scroll transactions-popup-content container">
          <div class="row">
            <div class="col-md-12">
              ${forSubmissionRack.join("")}
            </div>
          </div>
        </div>
      </div>
      `;
    },

    async sendStatus() {
      const vm = this;

      let payload = {
        referenceId: this.inwardReference.referenceId,
        indexes: this.checkRack,
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: "APPROVE AND SEND",
        content: vm.sendTemplate(),
        columnClass: "col-md-8",
        onOpenBefore: function() {
          const containerSection = $(this.$content).find(
            ".transactions-popup-content"
          );
          containerSection.css({
            "max-height": "450px",
            overflow: "auto",
          });
        },
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

              vm.$store.dispatch("inward/sendStatus", payload).then((res) => {
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
                  vm.checkRack = [];
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

    async downloadFile(type) {
      let data = await this.$store.dispatch("inward/downloadFile", {
        referenceId: this.inwardReference.referenceId,
        type,
      });

      const ext = type == "inward" ? "INC" : "tsv";
      let filename = "";

      if (type == "inward") filename = this.inwardReference.sequenceNumber;
      else if (type == "hotscan")
        filename = `HotScanPesonet-${this.inwardReference.sequenceNumber}`;
      else if (type == "tgs")
        filename = `TGSPesonet-${this.inwardReference.sequenceNumber}`;

      if (data instanceof Blob) saveAs(data, `${filename}.${ext}`);
      else
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
    },

    toggleCheckbox(idx) {
      $(`#checkbox-${idx}`).prop(
        "checked",
        !$(`#checkbox-${idx}`).is(":checked")
      );

      if (this.checkRack.includes(+idx))
        this.checkRack = this.checkRack.filter((chk) => chk != +idx);
      else this.checkRack.push(+idx);
    },

    checkAll() {
      $(".transaction-checkbox").prop("checked", true);
      this.checkRack = this.inwardMessage.CdtTrfTxInf.map((data, idx) => {
        if (!data.sentStatus) return idx;
      }).filter((d) => d !== undefined);
    },

    removeAll() {
      $(".transaction-checkbox").prop("checked", false);
      this.checkRack = [];
    },

    selectStatus() {
      const vm = this;
      const options = this.statusLists.map((status) => {
        return `<option value="${status.statusCode}">(${status.statusCode}) ${status.statusName}</option>`;
      });
      const content = `<div class="container">
                        <div class="row"> 
                          <div class="col">
                            <div class="form-group focused">
                              <select
                                class="selectpicker"
                                data-size="5"
                                data-live-search="true"
                                data-style="btn-danger"
                                data-width="100%"
                                name="popup-status-picker"
                                value="DS07"
                              >
                              ${options}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>`;

      this.$popover({
        icon: "far fa-question-circle",
        title: "SELECT STATUS",
        content,
        columnClass: "col-md-6",
        onContentReady: function() {
          this.$body.css("overflow", "visible");
          this.$contentPane.css("overflow", "visible");
          this.$content.css("overflow", "visible");
          this.$content
            .find("select[name='popup-status-picker']")
            .selectpicker("refresh");
        },
        buttons: {
          select: {
            text: "select",
            btnClass: "btn-success",
            action() {
              const selected = this.$content
                .find("select[name='popup-status-picker']")
                .val();

              vm.checkAllStatus = false;
              vm.checkRack.forEach((idx) => {
                vm.inwardMessage.CdtTrfTxInf[idx].status = selected;
              });
              vm.checkRack = [];

              vm.$nextTick(() => {
                $(".transaction-checkbox").prop("checked", false);
              });
            },
          },
          cancel: {
            text: "Cancel",
            btnClass: "btn-danger",
          },
        },
      });
    },
  },

  async created() {
    this.sockets.subscribe("InwardSave", async ({ data }) => {
      if (this.inwardReference?.referenceId == data.referenceId) {
        this.$nextTick(() => {
          $(".modal .selectpicker").selectpicker("destroy");
        });

        this.inwardReference = data || {};
        const { data: txnData, status } = await this.$store.dispatch(
          "inward/getTransactions",
          {
            referenceId: data.referenceId,
          }
        );
        let inwardMessage = txnData ? txnData.FIToFICstmrCdtTrf : {};
        if (this.inwardReference.status == 0)
          inwardMessage.CdtTrfTxInf.forEach((data, index) => {
            inwardMessage.CdtTrfTxInf[index].status =
              this.session.roleId == 3 ? 0 : "DS07";
            inwardMessage.CdtTrfTxInf[index].remarks = "";
          });

        this.inwardMessage = inwardMessage;
      }
    });
  },

  destroyed() {
    this.sockets.unsubscribe("InwardSave");
  },
};
</script>

<style scoped>
b.modal-title-section {
  font-size: 25px;
}

#inward-modal .modal-dialog {
  width: 95%;
}

textarea {
  height: auto !important;
}

.dropdown-item {
  cursor: pointer;
}

.dropdown-item:focus,
.dropdown-item:hover {
  color: #fff !important;
  background-color: #ec0c38;
}

.custom-control-alternative .custom-control-label::before {
  border: 1px solid black;
}

.custom-control-label::before {
  margin-top: -5px;
  width: 1.5rem;
  height: 1.5rem;
}

.custom-control-label::after {
  margin-top: -5px;
  width: 1.5rem;
  height: 1.5rem;
}

.same-line {
  display: inline-block;
}

span.stats-counter {
  font-size: 1rem;
}

.pdf-view-button {
  font-size: 25px;
  color: #f5365c !important;
  cursor: pointer;
}

button i {
  font-size: 20px;
}
</style>
