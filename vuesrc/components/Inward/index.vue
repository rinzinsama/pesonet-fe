<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h2 class="text-info" v-if="!isLoadingSync">
            LAST SYNC
            <i
              class="fas fa-sync-alt text-danger ml-2 manual-sync"
              @click="manualSync"
            ></i>
          </h2>
          <app-loader v-if="isLoadingSync" class="m-0" />
          <b v-if="!isLoadingSync">{{ lastSync }}</b>
        </div>
        <div class="col-md-6 text-right">
          <button type="button" class="btn btn-success" @click="generateFiles">
            GENERATE TGS/HOTSCAN
          </button>
        </div>
      </div>
      <div class="row mt-3">
        <div div class="col-md-3">
          <select
            class="selectpicker ignore justify-content-end"
            data-style="btn-danger"
            data-width="100%"
            v-model="filter"
          >
            <option value="-1">All</option>
            <option value="0">FOR STATUS UPDATE / REJECTED / FAILED</option>
            <option value="1">FOR APPROVAL / PARTIALLY UPDATED</option>
            <option value="2">SUCCESSFUL STATUS UPDATE</option>
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
          :class="filter == 3 ? 'offset-md-4' : 'offset-md-7'"
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
              @input="searchInwardBatch()"
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
            <th scope="col"><b>SEQUENCE NUMBER</b></th>
            <th scope="col"><b>CYCLE</b></th>
            <th scope="col"><b>SETTLEMENT DATE</b></th>
            <th scope="col"><b>NO. OF TRANSACTIONS</b></th>
            <th scope="col"><b>TOTAL AMOUNT</b></th>
            <th scope="col"><b>STATUS</b></th>
            <th scope="col"><b>ACTION</b></th>
          </tr>
        </thead>
        <tbody class="list">
          <tr v-for="(batch, key) in batches" :key="key">
            <td>{{ batch.sequenceNumber }}</td>
            <td>{{ batch.cycle }}</td>
            <td>{{ batch.settlementDate }}</td>
            <td>{{ batch.numberOfTransaction || "" }}</td>
            <td>{{ parseAmount(batch.totalAmount) || "" }}</td>
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
    <app-inward-modal
      :viewInwardModal.sync="viewInwardModal"
      :reference="ref"
    />
    <app-log-modal :viewInwardLog.sync="viewInwardLog" :logId="logId" />
    <app-generate-files :viewGenerateFilesModal.sync="viewGenerateFilesModal" />
  </div>
</template>

<script>
import Loader from "../master/Loader";
import Paginate from "vuejs-paginate";
import moment from "moment";
import InwardModal from "./modal/index";
import LogModal from "./modal/log";
import GenerateFilesModal from "./modal/GenerateFiles";
import { mapGetters } from "vuex";

export default {
  components: {
    appLoader: Loader,
    appPagination: Paginate,
    appInwardModal: InwardModal,
    appLogModal: LogModal,
    appGenerateFiles: GenerateFilesModal,
  },

  data() {
    return {
      viewGenerateFilesModal: 0,
      viewInwardModal: 0,
      viewInwardLog: 0,
      firstLoad: 1,
      isLoadingSync: 1,
      isLoading: 1,
      batches: [],
      ref: {},
      logId: 0,
      lastSync: "No data found.",
      filter: 0,
      date: localStorage.getItem("InwardDate") || "",
      search: localStorage.getItem("InwardSearch") || "",
      pages: 0,
      page: +localStorage.getItem("InwardPage") || 1,
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

        if (this.firstLoad == 0 && newVal != 3) this.searchInwardBatch();

        if (newVal == 3) this.initializeDatepicker();
      },
    },

    date(newVal, oldVal) {
      localStorage.setItem("InwardDate", newVal);
    },

    viewInwardModal(newVal, oldVal) {
      if (newVal == 0) this.ref = {};
    },

    viewInwardLog(newVal, oldVal) {
      if (newVal == 0) this.logId = 0;
    },
  },

  methods: {
    parseAmount(amount) {
      if (!amount) return "";

      const amt = `${amount}`.replace(/,/g, "");

      return (+amt).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
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

              if (vm.firstLoad == 0) await vm.searchInwardBatch();
            },
          })
          .data("datepicker");

        if (vm.date && vm.firstLoad == 1)
          dp.selectDate(moment(vm.date, "MMMM D, YYYY").toDate());
      });
    },

    getStatusMessage(status) {
      let statusMessage = "";

      if (status == 0) statusMessage = "FOR STATUS UPDATE";
      else if (status == 1) statusMessage = "FOR APPROVAL";
      else if (status == 2) statusMessage = "PARTIALLY UPDATED";
      else if (status == 3) statusMessage = "SUCCESSFUL STATUS UPDATE";
      else if (status == -2) statusMessage = "FAILED STATUS UPDATE";
      else if (status == -3) statusMessage = "REJECTED";

      return statusMessage;
    },

    async searchInwardBatch() {
      this.page = 1;
      await this.getBatches();
    },

    async getLastSync() {
      this.isLoadingSync = 1;

      const { status, data } = await this.$store.dispatch(
        "scheduler/getLastSync",
        {
          type: "SYNC INWARD",
        }
      );

      this.lastSync = data ? data.lastSync : "No data found.";

      this.isLoadingSync = 0;
    },

    async getBatches() {
      this.isLoading = 1;

      localStorage.setItem("InwardFilter", this.filter);
      localStorage.setItem("InwardSearch", this.search);
      localStorage.setItem("InwardPage", this.page);

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
        "inward/getInwardBatch",
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
                          <form class="modal-form-inward">
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
        title: "SYNC INWARD BATCH",
        content,
        columnClass: "col-md-10",
        onContentReady: function() {
          this.$content.find(".modal-form-inward").validate({
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
                .find(".modal-form-inward")
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
                  type: "INWARD",
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
      this.viewInwardModal = 1;
    },

    async viewLogs(data) {
      this.logId = data.referenceId;
      this.viewInwardLog = 1;
    },

    generateFiles() {
      this.viewGenerateFilesModal = 1;
    },
  },

  mounted() {
    $(".selectpicker").selectpicker("refresh");
  },

  async created() {
    this.filter =
      localStorage.getItem("InwardFilter") ||
      (this.session.roleId == 2 ? 0 : 1);

    await this.getLastSync();
    await this.getBatches();

    this.sockets.subscribe("SchedulerSave", async (sockData) => {
      if (sockData.type == "SYNC INWARD") {
        let { data } = await this.$store.dispatch("scheduler/getLastSync", {
          type: "SYNC INWARD",
        });

        this.lastSync = data ? data.lastSync : "No data found.";
      }
    });

    this.sockets.subscribe("InwardSave", async (sockData) => {
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
        "inward/getInwardBatch",
        payload
      );

      this.batches = data ? data : [];
      this.pages = lastPage || 0;
    });
  },

  destroyed() {
    this.sockets.unsubscribe("InwardSave");
    localStorage.removeItem("InwardDate");
    localStorage.removeItem("InwardFilter");
    localStorage.removeItem("InwardSearch");
    localStorage.removeItem("InwardPage");
  },
};
</script>

<style scoped>
.manual-sync {
  cursor: pointer;
}
</style>
