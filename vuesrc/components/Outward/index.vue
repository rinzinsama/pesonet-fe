<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h2 class="text-info" v-if="!isSyncLoading">
            LAST SYNC
            <i
              class="fas fa-sync-alt text-danger ml-2 manual-sync"
              @click="manualSync"
            ></i>
          </h2>
          <app-loader v-if="isSyncLoading" class="m-0" />
          <b v-if="!isSyncLoading">{{ lastSync }}</b>
        </div>
        <div class="col-md-6 text-right">
          <button
            type="button"
            class="btn btn-success"
            @click="createOutwardMessage"
            v-if="session.roleId == 2"
          >
            CREATE OUTWARD MESSAGE
          </button>
        </div>
      </div>
      <div class="row mt-3">
        <div div class="col-md-4">
          <select
            class="selectpicker ignore justify-content-end"
            data-style="btn-danger"
            data-width="100%"
            v-model="filter"
          >
            <option value="-1">All</option>
            <option value="0">FOR APPROVAL / PARTIALLY SENT</option>
            <option value="1">RECEIVED BY RFI / PARTIALLY PROCESSED BY RFI</option>
            <option value="2">PROCESSED BY RFI</option>
            <option value="-2">REJECTED</option>
            <option value="3">FILTER BY DATE</option>
          </select>
        </div>
        <div class="col-md-3" v-if="filter == 3">
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
        <div
          div
          class="col-md-2 text-right"
          :class="filter == 3 ? 'offset-md-3' : 'offset-md-6'"
        >
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
              @input="searchOutwardBatch()"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLoading == 1">
      <div class="row">
        <div class="col-md-12 pt-3 pb-3">
          <app-loader />
        </div>
      </div>
    </div>
    <div v-if="batches.length == 0 && isLoading == 0">
      <div class="row">
        <div class="col-md-12 text-center no-data-found">
          <h1>No data found.</h1>
        </div>
      </div>
    </div>
    <div class="table-responsive" v-if="isLoading == 0 && batches.length > 0">
      <table class="table align-items-center table-flush">
        <thead class="thead-light">
          <tr>
            <th scope="col"><b>REFERENCE NUMBER</b></th>
            <th scope="col"><b>SEQUENCE NUMBER</b></th>
            <th scope="col"><b>LOCAL EXTERNAL CODE</b></th>
            <th scope="col"><b>SETTLEMENT DATE</b></th>
            <th scope="col"><b>NO. OF TRANSACTIONS</b></th>
            <th scope="col"><b>TOTAL AMOUNT</b></th>
            <th scope="col"><b>DATE CREATED</b></th>
            <th scope="col"><b>STATUS</b></th>
            <th scope="col"><b>ACTION</b></th>
          </tr>
        </thead>
        <tbody class="list">
          <tr v-for="(batch, key) in batches" :key="key">
            <td>{{ batch.referenceId }}</td>
            <td v-html="nextLineParser(batch.sequenceNumber, ', ')"></td>
             <td v-html="nextLineParser(batch.localExternalCode, ',')"></td>
            <td v-html="nextLineParser(batch.settlementDate, ' - ')"></td>
            <td>{{ batch.numberOfTransaction || "" }}</td>
            <td>{{ parseAmount(batch.totalAmount) || "" }}</td>
            <td v-html="nextLineParser(batch.createdAt, ' - ')"></td>
            <td>{{ getStatusMessage(batch.status) }}</td>
            <td>
              <button
                type="button"
                class="btn btn-danger btn-sm btn-block"
                @click.prevent="viewDetails(batch)"
              >
                VIEW DETAILS
              </button>
              <button
                type="button"
                class="btn btn-info btn-sm btn-block"
                @click.prevent="viewLogs(batch)"
              >
                VIEW LOGS
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer py-4" v-if="pages > 1 && isLoading == 0">
      <nav aria-label="...">
        <app-pagination
          v-show="pages > 1"
          :page-count="pages"
          :container-class="'pagination justify-content-end mb-0'"
          v-model="page"
          :click-handler="getBatches"
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
      </nav>
    </div>
    <app-outward-modal
      :viewOutwardModal.sync="viewOutwardModal"
      :reference="ref"
    />
    <app-create-outward-modal
      :viewCreateOutwardModal.sync="viewCreateOutwardModal"
      :outwardModalView.sync="outwardModalView"
      :outwardData.sync="outwardData"
    />
    <app-log-modal :viewOutwardLog.sync="viewOutwardLog" :logId="logId" />
  </div>
</template>

<script>
import Loader from "../master/Loader";
import Paginate from "vuejs-paginate";
import moment from "moment";
import OutwardModal from "./modal/index";
import CreateOutwardModal from "./modal/outward";
import LogModal from "./modal/log";
import { mapGetters } from "vuex";

export default {
  components: {
    appLoader: Loader,
    appPagination: Paginate,
    appOutwardModal: OutwardModal,
    appCreateOutwardModal: CreateOutwardModal,
    appLogModal: LogModal,
  },

  data() {
    return {
      viewOutwardModal: 0,
      viewCreateOutwardModal: 0,
      viewOutwardLog: 0,
      outwardModalView: "",
      outwardData: {},
      firstLoad: 1,
      isSyncLoading: 1,
      isLoading: 1,
      batches: [],
      ref: {},
      logId: 0,
      lastSync: "No data found.",
      filter: 0,
      date: localStorage.getItem("OutwardDate") || "",
      search: localStorage.getItem("OutwardSearch") || "",
      pages: 0,
      page: +localStorage.getItem("OutwardPage") || 1,
      limit: 5,
    };
  },

  computed: {
    ...mapGetters({
      session: "getSession",
    }),
  },

  watch: {
    filter: {
      immediate: true,
      handler(newVal, oldVal) {
        if (this.firstLoad == 0) this.date = "";

        if (this.firstLoad == 0 && newVal != 3) this.searchOutwardBatch();

        if (newVal == 3) this.initializeDatepicker();
      },
    },

    date(newVal, oldVal) {
      // localStorage.setItem("OutwardDate", newVal);
    },

    viewOutwardModal(newVal, oldVal) {
      if (newVal == 0) this.ref = {};
    },

    viewCreateOutwardModal(newVal, oldVal) {
      if (newVal == 0) {
        this.outwardModalView = "";
        this.outwardData = {};
      }
    },

    viewOutwardLog(newVal, oldVal) {
      if (newVal == 0) this.logId = 0;
    },
  },

  methods: {
    nextLineParser(value, splitBy) {
      if (!value) return "";

      const rack = value.split(splitBy);

      return rack.join("<br>");
    },

    parseAmount(amount) {
      if (!amount) return "";

      const amt = `${amount}`.replace(/,/g, "");

      return (+amt).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    },

    createOutwardMessage() {
      const vm = this;

      this.$popover({
        icon: "far fa-question-circle",
        title: "CREATE OUTWARD MESSAGE",
        content: "",
        columnClass: "col-md-7",
        onOpenBefore: function() {
          this.$$upload.css("width", "32.3%");
          this.$$manual.css("width", "32.3%");
          this.$$cancel.css("width", "32.3%");
          this.$content.css("height", "0");
        },
        buttons: {
          upload: {
            text: "upload",
            btnClass: "btn-success",
            action() {
              vm.viewCreateOutwardModal = 1;
              vm.outwardModalView = "upload";
            }
          },
          manual: {
            text: "manual input",
            btnClass: "btn-success",
            action() {
              vm.viewCreateOutwardModal = 1;
              vm.outwardModalView = "manual";
            }
          },
          cancel: {
            text: "Cancel",
            btnClass: "btn-danger",
          },
        }
      })
    },

    initializeDatepicker() {
      const vm = this;

      this.$nextTick(() => {
        const dp = $("input[name='date']")
          .datepicker({
            autoClose: true,
            language: "en",
            toggleSelected: false,
            dateFormat: "MM d, yyyy",
            onSelect: async function(fd, d, picker) {
              vm.date = fd;

              if (vm.firstLoad == 0) await vm.searchOutwardBatch();
            },
          })
          .data("datepicker");

        if (vm.date && vm.firstLoad == 1)
          dp.selectDate(moment(vm.date, "MMMM D, YYYY").toDate());
      });
    },

    getStatusMessage(status) {
      let statusMessage = "";

      if (status == 0) statusMessage = "FOR APPROVAL";
      else if (status == 1) statusMessage = "PARTIALLY SENT";
      else if (status == 2) statusMessage = "RECEIVED BY RFI";
      else if (status == 3) statusMessage = "PARTIALLY PROCESSED BY RFI";
      else if (status == 4) statusMessage = "PROCESSED BY RFI";
      else if (status == -2) statusMessage = "REJECTED";

      return statusMessage;
    },

    async searchOutwardBatch() {
      this.page = 1;
      await this.getBatches();
    },

    async getLastSync() {
      this.isSyncLoading = 1;

      const { status, data } = await this.$store.dispatch(
        "scheduler/getLastSync",
        {
          type: "SYNC OUTWARD",
        }
      );

      this.lastSync = data ? data.lastSync : "No data found.";

      this.isSyncLoading = 0;
    },

    async getBatches() {
      this.isLoading = 1;

      // localStorage.setItem("OutwardFilter", this.filter);
      // localStorage.setItem("OutwardSearch", this.search);
      // localStorage.setItem("OutwardPage", this.page);

      let payload = {
        page: this.page,
        limit: this.limit,
        search: this.search,
        filter: this.filter,
        date: this.date
          ? moment(this.date, "MMMM D, YYYY").format("YYYY-MM-DD")
          : "",
      };

      const { status, data, lastPage } = await this.$store.dispatch(
        "outward/getOutwardBatch",
        payload
      );

      this.batches = data ? data : [];
      this.pages = lastPage || 0;

      this.isLoading = 0;
      this.firstLoad = 0;
    },

    async manualSync() {
      const vm = this;

      const content = `<div class="container">
                          <form class="modal-form-outward">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                        <label class="form-control-label">SETTLEMENT DATE</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            name="settlementDate"
                                            readonly="true"
                                        />
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                        <label class="form-control-label">CYCLE</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            name="cycle"
                                        />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>`;

      this.$popover({
        icon: "far fa-question-circle",
        title: "SYNC OUTWARD BATCH",
        content,
        columnClass: "col-md-10",
        onContentReady: function() {
          this.$content.find(".modal-form-outward").validate({
            rules: {
              settlementDate: {
                required: true,
              },
              cycle: {
                required: true,
                digits: true,
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

          this.$content.find("input[name='settlementDate']").datepicker({
            autoClose: true,
            language: "en",
            toggleSelected: false,
            dateFormat: "MM d, yyyy",
          });
        },
        buttons: {
          submit: {
            text: "submit",
            btnClass: "btn-success",
            keys: ["enter"],
            action() {
              let JCinstance = this;

              const valid = JCinstance.$content
                .find(".modal-form-outward")
                .valid();
              const settlementDate = JCinstance.$content
                .find("input[name='settlementDate']")
                .val();
              const cycle = JCinstance.$content
                .find("input[name='cycle']")
                .val();

              if (valid) {
                JCinstance.$$submit.hide();
                JCinstance.$$cancel.hide();

                JCinstance.setContent("Processing....");
                JCinstance.setIcon("fas fa-circle-notch fa-pulse");

                const payload = {
                  type: "OUTWARD",
                  settlementDate: moment(settlementDate, "MMMM D, YYYY").format(
                    "YYYY-MM-DD"
                  ),
                  cycle,
                };

                vm.$store
                  .dispatch("scheduler/syncIndex", payload)
                  .then((res) => {
                    const { status, message } = res;

                    JCinstance.setContent(
                      status == 200
                        ? `<div style='color: #24a46d;font-weight: bold;text-align: center;font-size: 25px;'>${message}</div>`
                        : `<div style='color: #f5365c;font-weight: bold;text-align: center;font-size: 25px;'>${message}</div>`
                    );

                    JCinstance.setIcon(
                      status == 200
                        ? "far fa-check-circle"
                        : "fas fa-exclamation-triangle"
                    );

                    JCinstance.$$close.show();
                  });
              }

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

    async viewDetails(data) {
      this.ref = data;

      if (this.session.roleId == 3 && [0,1].includes(data.status)) {
        this.viewCreateOutwardModal = 1;
        this.outwardModalView = "edit";
        this.outwardData = data;
      } else this.viewOutwardModal = 1;
    },

    async viewLogs(data) {
      this.logId = data.referenceId;
      this.viewOutwardLog = 1;
    },
  },

  mounted() {
    $(".selectpicker").selectpicker("refresh");
  },

  async created() {
    this.filter =
      localStorage.getItem("OutwardFilter") ||
      (this.session.roleId == 2 ? -1 : 0);

    await this.getLastSync();
    await this.getBatches();

    this.sockets.subscribe("SchedulerSave", async (sockData) => {
      if (sockData.type == "SYNC OUTWARD") {
        let { data } = await this.$store.dispatch("scheduler/getLastSync", {
          type: "SYNC OUTWARD",
        });

        this.lastSync = data ? data.lastSync : "No data found.";
      }
    });

    this.sockets.subscribe("OutwardSave", async (sockData) => {
      let payload = {
        page: this.page,
        limit: this.limit,
        search: this.search,
        filter: this.filter,
        date: this.date
          ? moment(this.date, "MMMM D, YYYY").format("YYYY-MM-DD")
          : "",
      };

      let { data, lastPage } = await this.$store.dispatch(
        "outward/getOutwardBatch",
        payload
      );

      this.batches = data ? data : [];
      this.pages = lastPage || 0;

      if(this.outwardData.referenceId == sockData.data.referenceId) {
        this.outwardData = sockData.data
      }
    });
  },

  destroyed() {
    this.sockets.unsubscribe("OutwardSave");
    localStorage.removeItem("OutwardDate");
    localStorage.removeItem("OutwardFilter");
    localStorage.removeItem("OutwardSearch");
    localStorage.removeItem("OutwardPage");
  },
};
</script>

<style scoped>
.manual-sync {
  cursor: pointer;
}
</style>
