<template>
  <div class="min-vw-50">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col-md-2 text-danger">
          <b class="header-labels"
            >TRANSACTIONS
            <i class="far fa-question-circle ml-2 legends-popover"></i
          ></b>
        </div>

        <div class="col-md-6 offset-md-4 text-right" v-if="isLoading == 0 && !isSyncing && !needsResync">
          <button
            type="button"
            class="btn btn-success"
            @click.prevent="regenerateFiles"
          >
            REGENERATE FILES
          </button>

          <button
            type="button"
            class="btn btn-success"
            @click.prevent="downloadFiles"
          >
            DOWNLOAD FILES
          </button>
        </div>
      </div>
    </div>

    <div class="custom-loader-middle" v-if="isLoading == 1">
      <div class="row">
        <div class="col-md-12 pt-3 pb-3">
          <app-loader />
        </div>
      </div>
    </div>

    <div class="card-body" v-if="isLoading == 0">
      <div class="row align-items-center mb-4">
        <div class="col-md-3">
          <app-pagination
            v-show="pages > 1"
            :page-count="pages"
            :container-class="'pagination m-0'"
            v-model="page"
            :click-handler="scrollToBottom"
            :page-class="'page-item'"
            :page-link-class="'page-link'"
            :prev-class="'page-item'"
            :next-class="'page-item'"
            :next-link-class="'page-link'"
            :prev-link-class="'page-link'"
            :hide-prev-next="true"
            :prev-text="`<i class='fas fa-angle-left' />`"
            :next-text="`<i class='fas fa-angle-right' />`"
          />
        </div>

        <div class="col-md-6 d-flex filter-section">
          <div class="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              id="radioButton1"
              name="filter"
              class="custom-control-input is-invalid"
              value="0"
              v-model="filter"
            />
            <label class="custom-control-label" for="radioButton1"
              >ALL
              <span class="text-primary count-section">
                ({{ transactions.length }})
              </span>
            </label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              id="radioButton2"
              name="filter"
              class="custom-control-input is-invalid"
              value="1"
              v-model="filter"
            />
            <label class="custom-control-label" for="radioButton2"
              >FOR STATUS TAGGING
              <span class="text-primary count-section">
                ({{ forStatusTaggingCount }})
              </span>
            </label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              id="radioButton3"
              name="filter"
              class="custom-control-input is-invalid"
              value="2"
              v-model="filter"
            />
            <label class="custom-control-label" for="radioButton3"
              >FOR APPROVAL
              <span class="text-primary count-section">
                ({{ forApprovalCount }})
              </span>
            </label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              id="radioButton4"
              name="filter"
              class="custom-control-input is-invalid"
              value="3"
              v-model="filter"
            />
            <label class="custom-control-label" for="radioButton4">
              SENT
              <span class="text-primary count-section">
                ({{ sentCount }})
              </span>
            </label>
          </div>
        </div>

        <div div class="col-md-2 offset-md-1 text-right">
          <div class="input-group input-group-alternative input-group-merge">
            <div class="input-group-prepend">
              <span class="input-group-text"
                ><i class="fas fa-search"></i
              ></span>
            </div>
            <input
              class="form-control"
              placeholder="SEARCH"
              type="text"
              v-model="search"
              @keydown.stop="scrollToBottom"
            />
          </div>
        </div>
      </div>

      <div v-if="shownTransactions.length == 0">
        <div class="row">
          <div class="col-md-12 text-center no-data-found">
            <h1>No data found.</h1>
          </div>
        </div>
      </div>

      <div class="accordion" id="inwardTransactionAccordion">
        <div
          class="card mb-0"
          v-for="(transaction, index) in shownTransactions"
          :key="index"
        >
          <div
            class="card-header text-white"
            :class="getHeaderClass(transaction.index)"
            :id="`heading${index}`"
            data-toggle="collapse"
            :data-target="`#collapse${index}`"
            aria-expanded="false"
            :aria-controls="`collapse${index}`"
          >
            <div class="row">
              <div class="col-md-6">
                <div
                  class="dont-collapse custom-control custom-control-alternative custom-checkbox mr-4 same-line"
                  v-if="hasCheckbox(transaction.index)"
                >
                  <input
                    class="custom-control-input transaction-checkbox"
                    :id="`checkbox-${transaction.index}`"
                    type="checkbox"
                    :value="transaction.index"
                    v-model="checkRack"
                  />
                  <label
                    class="custom-control-label"
                    :for="`checkbox-${transaction.index}`"
                  ></label>
                </div>

                <h3 class="mb-0 text-white same-line">
                  #{{ transaction.sequenceNumber }} -
                  {{ transaction.ofiReferenceNumber }} - PHP
                  {{ parseAmount(transaction.amount) }}
                </h3>
              </div>
              <div class="col-md-6 text-right pr-5">
                <h3 class="mb-0 text-white">
                  {{ transaction.status }}
                </h3>
              </div>
            </div>
          </div>

          <div
            :id="`collapse${index}`"
            class="collapse collapsible-section"
            :aria-labelledby="`heading${index}`"
            data-parent="#inwardTransactionAccordion"
          >
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-control-label">SEQUENCE NUMBER</label>
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
                    <label class="form-control-label">END TO END ID</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="transaction.endToEndId"
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
                      :value="transaction.ofiReferenceNumber"
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
                      :value="transaction.rfiReferenceNumber"
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
                      :value="transaction.ofiCustomerReferenceNumber"
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
                      v-model="transaction.instructions"
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
                      value="PHP"
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
                  <h2>
                    STATUS AND REMARKS
                  </h2>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6" v-if="!isReadOnly(transaction.index)">
                  <div class="form-group focused">
                    <label class="form-control-label">STATUS</label>
                    <select
                      class="inward-transaction-selectbox"
                      data-size="5"
                      data-live-search="true"
                      data-style="btn-danger"
                      data-width="100%"
                      v-model="transaction.status"
                    >
                      <option value="0" hidden>PLEASE SELECT STATUS</option>
                      <option
                        v-for="(list, index) in inwardStatusList"
                        :key="index"
                        :value="list.statusCode"
                        >({{ list.statusCode }}) {{ list.statusName }}</option
                      >
                    </select>
                  </div>
                </div>

                <div class="col-md-6" v-if="isReadOnly(transaction.index)">
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
                      :class="{
                        'is-invalid': checkRemarks(transaction.remarks),
                      }"
                      rows="4"
                      v-model="transaction.remarks"
                      :readonly="isReadOnly(transaction.index)"
                    />
                    <label
                      class="jv-error"
                      v-if="checkRemarks(transaction.remarks)"
                      >Only alphanumeric characters, some special characters and
                      spaces are allowed.</label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="card-footer footer-button-section d-flex"
      v-if="
        !isSyncing &&
          isLoading == 0 &&
          shownTransactions.length > 0 &&
          checkBoxCount > 0 &&
          !needsResync
      "
    >
      <button
        type="button"
        class="btn btn-success px-3"
        @click="checkAll"
        v-if="!isAllChecked"
      >
        <i class="fas fa-check-double"></i>
      </button>

      <button
        type="button"
        class="btn btn-warning px-3"
        @click="unCheckAll"
        v-if="isAllChecked"
      >
        <i class="far fa-times-circle"></i>
      </button>

      <button
        type="button"
        class="btn btn-danger"
        v-if="session.roleId == 2"
        :disabled="checkRack.length == 0"
        @click.prevent="selectStatus"
      >
        SELECT STATUS
        <span class="badge badge-primary">{{ checkRack.length }}</span>
      </button>

      <div class="hidden mr-auto" />

      <button
        type="button"
        class="btn btn-success"
        v-if="session.roleId == 2"
        :disabled="checkRack.length == 0 || hasError"
        @click.prevent="saveConsolidatedInward('update')"
      >
        UPDATE STATUS
        <span class="badge badge-primary">{{ checkRack.length }}</span>
      </button>

      <button
        type="button"
        class="btn btn-warning"
        v-if="session.roleId == 3"
        :disabled="checkRack.length == 0"
        @click.prevent="saveConsolidatedInward('reject')"
      >
        REJECT
        <span class="badge badge-primary">{{ checkRack.length }}</span>
      </button>

      <button
        type="button"
        class="btn btn-success"
        v-if="session.roleId == 3"
        :disabled="checkRack.length == 0"
        @click.prevent="saveConsolidatedInward('send')"
      >
        APPROVE AND SEND
        <span class="badge badge-primary">{{ checkRack.length }}</span>
      </button>
    </div>

    <app-download-files
      :viewDownloadFilesModal.sync="viewDownloadFilesModal"
      :settlementDate="settlementDate"
    />
  </div>
</template>

<script>
import moment from "moment";
import Loader from "../master/Loader";
import Paginate from "vuejs-paginate";
import DownloadFiles from "./modal/DownloadFiles";

import { mapGetters } from "vuex";

export default {
  components: {
    appPagination: Paginate,
    appLoader: Loader,
    appDownloadFiles: DownloadFiles
  },

  props: ["settlementDate", "isSyncing", "needsResync"],

  data() {
    return {
      isLoading: 1,
      inwardStatusList: [],
      transactions: [],
      limit: 5,
      page: +localStorage.getItem("InwardTransactionPage") || 1,
      pages: 0,
      search: localStorage.getItem("InwardTransactionSearch") || "",
      filter: +localStorage.getItem("InwardTransactionFilter") || 0,
      checkRack: [],
      viewDownloadFilesModal: 0,
    };
  },

  watch: {
    settlementDate: {
      immediate: true,
      async handler(newVal, oldVal) {
        if (oldVal) {
          this.page = 0;
          this.search = "";
          this.filter = 0;
        }

        this.getTransactions();
      },
    },

    filter(newVal, oldVal) {
      this.search = "";
      this.page = 1;
      this.checkRack = [];
      this.scrollToBottom();
    },

    search() {
      this.page = 1;
    },
  },

  computed: {
    ...mapGetters({
      session: "getSession",
    }),

    shownTransactions() {
      localStorage.setItem("InwardTransactionSearch", this.search);
      localStorage.setItem("InwardTransactionPage", this.page);
      localStorage.setItem("InwardTransactionFilter", this.filter);

      const baseTransaction = this.transactions.filter((txn) => {
        const rxp = new RegExp(this.search);

        return +this.filter == 0
          ? rxp.test(txn.sequenceNumber) ||
              rxp.test(txn.ofiReferenceNumber) ||
              rxp.test(txn.amount) ||
              rxp.test(txn.status)
          : (rxp.test(txn.sequenceNumber) ||
              rxp.test(txn.ofiReferenceNumber) ||
              rxp.test(txn.amount) ||
              rxp.test(txn.status)) &&
              txn.flowStatus == this.filter;
      });

      this.pages = Math.ceil(baseTransaction.length / this.limit);

      return baseTransaction.slice(
        (this.page - 1) * this.limit,
        this.limit * this.page
      );
    },

    forStatusTaggingCount() {
      return this.transactions.filter((txn) => txn.flowStatus == 1).length;
    },

    forApprovalCount() {
      return this.transactions.filter((txn) => txn.flowStatus == 2).length;
    },

    sentCount() {
      return this.transactions.filter((txn) => txn.flowStatus == 3).length;
    },

    isAllChecked() {
      const txns = this.transactions.filter((txn) => {
        const stat = this.session.roleId == 2 ? 1 : 2;

        return txn.flowStatus == stat;
      });

      return txns.length == this.checkRack.length;
    },

    hasError() {
      return this.transactions.filter((txn) => this.checkRemarks(txn.remarks))
        .length > 0
        ? true
        : false;
    },

    checkBoxCount() {
      let count =
        this.session.roleId == 2
          ? this.forStatusTaggingCount
          : this.forApprovalCount;

      return count;
    },
  },

  methods: {
    triggerPopover() {
      $(".legends-popover").popover({
        title: "HEADER COLOR LEGEND",
        content: `
        <div class="text-primary d-flex align-items-center pop-head">
          <span class="pop-square bg-primary mr-2"></span> FOR STATUS TAGGING
        </div>
        <div class="text-info d-flex align-items-center pop-head">
          <span class="pop-square bg-info mr-2"></span> FOR APPROVAL
        </div>
        <div class="text-success d-flex align-items-center pop-head">
          <span class="pop-square bg-success mr-2"></span> SENT
        </div>
        <div class="text-warning d-flex align-items-center pop-head">
          <span class="pop-square bg-warning mr-2"></span> REJECTED
        </div>
        <div class="text-danger d-flex align-items-center pop-head">
          <span class="pop-square bg-danger mr-2"></span> HAS ERROR
        </div>
      `,
        html: true,
        trigger: "hover",
      });
    },

    scrollToBottom() {
      $(".collapsible-section").removeClass("show");
      $("html,body").animate({ scrollTop: $(".main-content").height() }, 1);
    },

    parseAmount(amount) {
      const amt = `${amount}`.replace(/,/g, "");

      return (+amt).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    },

    getHeaderClass(idx) {
      const status = this.transactions[idx].flowStatus;
      const isRejected = this.transactions[idx].isRejected;

      let headerClass = "";

      if (this.checkRemarks(this.transactions[idx].remarks))
        headerClass = "bg-danger";
      else if (isRejected) headerClass = "bg-warning";
      else if (status == 1) headerClass = "bg-primary";
      else if (status == 2) headerClass = "bg-info";
      else headerClass = "bg-success";

      return headerClass;
    },

    hasCheckbox(idx) {
      return (
        (this.session.roleId == 2 && this.transactions[idx].flowStatus == 1) ||
        (this.session.roleId == 3 && this.transactions[idx].flowStatus == 2)
      );
    },

    isReadOnly(idx) {
      return (
        (this.session.roleId == 2 && this.transactions[idx].flowStatus != 1) ||
        this.session.roleId == 3
      );
    },

    async getInwardStatusList() {
      const { data } = await this.$store.dispatch("statuslist/getListsActive");

      this.inwardStatusList = data || [];
    },

    async getTransactions() {
      this.isLoading = 1;

      let payload = {
        settlementDate: moment(this.settlementDate, "MMMM D, YYYY").format(
          "YYYY-MM-DD"
        ),
      };

      const { status, data } = await this.$store.dispatch(
        "inward/getConsolidatedTransactions",
        payload
      );

      this.transactions = data ? data : [];
      this.pages = Math.ceil(this.transactions.length / this.limit);
      this.isLoading = 0;
    },

    checkAll() {
      const txns = this.transactions.filter((txn) => {
        const stat = this.session.roleId == 2 ? 1 : 2;

        return txn.flowStatus == stat;
      });

      this.checkRack = txns.map((txn) => txn.index);
    },

    unCheckAll() {
      this.checkRack = [];
    },

    selectStatus() {
      const vm = this;

      const options = this.inwardStatusList.map((status) => {
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
        onOpenBefore: function() {
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

              vm.checkRack.forEach((idx) => {
                vm.transactions[idx].status = selected;
              });

              vm.checkRack = [];
            },
          },
          cancel: {
            text: "Cancel",
            btnClass: "btn-danger",
          },
        },
      });
    },

    checkRemarks(remarks) {
      return !/^([a-zA-Z0-9\/\-\?:\(\)\.,'\+ ]*)$/.test(remarks);
    },

    regenerateFiles() {
      const vm = this;

      const payload = {
        settlementDate: moment(this.settlementDate, "MMMM D, YYYY").format(
          "YYYY-MM-DD"
        ),
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: "REGENERATE FILES",
        content: `This will regenerate tgs and hotscan files for ${this.settlementDate}`,
        columnClass: "col-md-8",
        buttons: {
          regenerate: {
            text: "Regenerate",
            btnClass: "btn-success",
            action() {
              let JCinstance = this;

              JCinstance.$$regenerate.hide();
              JCinstance.$$cancel.hide();

              JCinstance.setContent("Processing....");
              JCinstance.setIcon("fas fa-circle-notch fa-pulse");

              vm.$store
                .dispatch("inward/regenerateFiles", payload)
                .then((res) => {
                  const { status, message, errors } = res;

                  JCinstance.setIcon(
                    status == 200
                      ? "far fa-check-circle"
                      : "fas fa-exclamation-triangle"
                  );

                  JCinstance.setContent(
                    status == 200
                      ? message
                      : `<b>${message}</b>${
                          "<br />" + errors ? errors.join("<br />") : ""
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

    downloadFiles() {
      this.viewDownloadFilesModal = 1;
    },

    submitTemplate(label, errorMessage = "") {
      const forSubmissionRack = this.checkRack.map((idx) => {
        const txn = this.transactions.find((txn) => txn.index == idx);

        return `<div class="col-md-12"> #${txn.sequenceNumber} - ${
          txn.ofiReferenceNumber
        } - PHP ${this.parseAmount(txn.amount)}</div>`;
      });

      return `
      <div>
        ${
          errorMessage.length > 0
            ? `<b class="text-danger">${errorMessage}</b>`
            : ""
        }
        <h3>NUMBER OF TRANSACTIONS TO BE ${label}: <span class="text-success">${
        forSubmissionRack.length
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

    async saveConsolidatedInward(type) {
      $(".collapsible-section").removeClass("show");
      const vm = this;

      const transRack = this.checkRack.map((idx) => {
        return this.transactions.find((txn) => txn.index == idx);
      });

      let label = "";
      let title = "";

      if (type == "update") {
        label = "UPDATED";
        title = "UPDATE";
      } else if (type == "reject") {
        label = "REJECTED";
        title = "REJECT";
      } else {
        label = "SENT";
        title = "APPROVE AND SEND";
      }

      const payload = {
        settlementDate: moment(this.settlementDate, "MMMM D, YYYY").format(
          "YYYY-MM-DD"
        ),
        transactions: transRack,
        type,
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: `${title} STATUS`,
        content: vm.submitTemplate(label),
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

              vm.$store
                .dispatch("inward/saveConsolidatedInward", payload)
                .then((res) => {
                  const { status, message, errors } = res;

                  JCinstance.setIcon(
                    status == 200
                      ? "far fa-check-circle"
                      : "fas fa-exclamation-triangle"
                  );

                  JCinstance.setContent(
                    status == 200
                      ? message
                      : vm.submitTemplate(
                          label,
                          `<b>${message}</b> <br /> ${
                            errors ? errors.join("<br />") : ""
                          }`
                        )
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
  },

  beforeUpdate() {
    $(".inward-transaction-selectbox").selectpicker("destroy");
  },

  updated() {
    this.$nextTick(function() {
      if (this.session.roleId == 2 && this.forStatusTaggingCount > 0)
        $(".inward-transaction-selectbox").selectpicker("refresh");

      if (this.isLoading == 0) this.triggerPopover();
    });
  },

  created() {
    this.getInwardStatusList();

    this.sockets.subscribe("InwardSave", async (sockData) => {
      let payload = {
        settlementDate: moment(this.settlementDate, "MMMM D, YYYY").format(
          "YYYY-MM-DD"
        ),
      };

      const { status, data } = await this.$store.dispatch(
        "inward/getConsolidatedTransactions",
        payload
      );

      this.transactions = data ? data : [];
    });

    this.sockets.subscribe("InwardTransactionSave", async (sockData) => {
      if (
        sockData.date ==
        moment(this.settlementDate, "MMMM D, YYYY").format("YYYY-MM-DD")
      ) {
        let payload = {
          settlementDate: moment(this.settlementDate, "MMMM D, YYYY").format(
            "YYYY-MM-DD"
          ),
        };

        const { status, data } = await this.$store.dispatch(
          "inward/getConsolidatedTransactions",
          payload
        );

        this.transactions = data ? data : [];
      }
    });
  },

  destroyed() {
    this.sockets.unsubscribe("InwardSave");
    this.sockets.unsubscribe("InwardTransactionSave");
    localStorage.removeItem("InwardTransactionSearch");
    localStorage.removeItem("InwardTransactionPage");
    localStorage.removeItem("InwardTransactionFilter");
  },
};
</script>

<style scoped>
.custom-control-alternative .custom-control-label::before {
  border: 1px solid #f5365c;
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

.accordion .custom-control-label::before {
  margin-top: -0.9rem;
  width: 2.5rem;
  height: 2.5rem;
}

.accordion .custom-control-label::after {
  margin-top: -0.9rem;
  width: 2.5rem;
  height: 2.5rem;
}

.same-line {
  display: inline-block;
}

.header-labels {
  font-size: 25px;
}

.filter-section {
  justify-content: space-between;
}

.custom-control-input:checked ~ .custom-control-label::before {
  border-color: #f5365c;
  background-color: #f5365c;
}

.custom-control-input:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #f5365c;
}

.custom-control-input:not(:disabled):active ~ .custom-control-label::before {
  border-color: #f5365c;
  background-color: #f5365c;
}

.custom-radio .custom-control-label::after {
  background-size: 0%;
}

label.custom-control-label {
  font-weight: bold;
}

.count-section {
  top: 0;
}

.footer-button-section {
  justify-content: flex-end;
}

textarea {
  height: auto !important;
}

.min-vw-50 {
  min-height: 50vh;
  position: relative;
}

.custom-loader-middle {
  position: absolute;
  margin: 0 auto;
  width: 100%;
  top: 50%;
}
</style>

<style>
.pop-square {
  width: 15px;
  height: 15px;
}

.pop-head {
  font-weight: bold;
  font-size: 15px;
}
</style>
