<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col-md-2">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text"
                ><i class="far fa-calendar-alt"></i
              ></span>
            </div>
            <input
              type="text"
              class="form-control"
              name="inward_settlement_date"
              placeholder="SETTLEMENT DATE"
              :value="settlementDate"
              readonly
            />
          </div>
        </div>
        <div class="col-md-3 offset-md-7 text-right" v-if="hasData != 0">
          <button
            type="button"
            class="btn btn-icon btn-info"
            v-if="!isLoadingSync && !isSyncing && !needsResync"
            @click.prevent="viewLogs"
          >
            <span class="btn-inner--text">LOGS</span>
            <span class="btn-inner--icon"
              ><i class="fas fa-clipboard-list"></i
            ></span>
          </button>

          <h4 v-if="needsResync && !isSyncing" class="text-danger">
            ERROR DURING SYNCING. PLEASE RE-SYNC
          </h4>
          <button
            class="btn btn-icon btn-danger m-0"
            type="button"
            @click.prevent="reSync"
            v-if="needsResync && !isSyncing"
          >
            <span class="btn-inner--text">RE-SYNC</span>
            <span class="btn-inner--icon"><i class="fas fa-sync-alt"></i></span>
          </button>

          <button
            class="btn btn-icon btn-danger m-0"
            type="button"
            v-if="!isLoadingSync && !isSyncing && !needsResync"
            @click.prevent="manualSync"
          >
            <span class="btn-inner--text">SYNC</span>
            <span class="btn-inner--icon"><i class="fas fa-sync-alt"></i></span>
          </button>

          <h2 class="text-info" v-if="isSyncing">
            SYNCING
            <i class="fas fa-circle-notch fa-pulse text-danger ml-2"></i>
          </h2>
        </div>
      </div>
    </div>

    <div v-if="hasData == 0">
      <div class="row">
        <div class="col-md-12 pt-3 pb-3">
          <app-loader />
        </div>
      </div>
    </div>

    <div class="row" v-if="hasData == -1">
      <div class="col-md-12 text-center no-data-found">
        <h1>NO INWARD MESSAGE ON {{ upperCaseDate }}</h1>
      </div>
    </div>

    <app-table v-if="hasData == 1" :settlementDate="settlementDate" />
    <app-transactions
      v-if="hasData == 1"
      :settlementDate="settlementDate"
      :isSyncing="isSyncing"
      :needsResync="needsResync"
    />

    <app-logs
      :viewLogsModal.sync="viewLogsModal"
      :settlementDate="settlementDate"
    />
  </div>
</template>

<script>
import moment from "moment";
import Loader from "../master/Loader";
import Paginate from "vuejs-paginate";
import Table from "./Table";
import Transactions from "./Transactions";
import Logs from "./modal/Logs";

export default {
  components: {
    appLoader: Loader,
    appPagination: Paginate,
    appTable: Table,
    appTransactions: Transactions,
    appLogs: Logs,
  },

  data() {
    return {
      isLoadingSync: 1,
      lastSync: "No data found.",
      isSyncing: false,
      needsResync: false,
      settlementDate: "",
      hasData: 0,
      viewLogsModal: 0,
    };
  },

  watch: {
    async settlementDate(newVal, oldVal) {
      Promise.all([await this.checkForResync(), this.checkHasData()]);
      localStorage.setItem("InwardSettlementDate", this.settlementDate);
    },
  },

  computed: {
    upperCaseDate() {
      return this.settlementDate.toUpperCase();
    },
  },

  methods: {
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

    async getIsSyncing() {
      const { status, data } = await this.$store.dispatch(
        "scheduler/isSyncing",
        {
          type: "inward",
        }
      );

      this.isSyncing = data.isSyncing || false;
    },

    async checkForResync() {
      const { status, data } = await this.$store.dispatch(
        "inward/checkForResync",
        {
          settlementDate: moment(this.settlementDate, "MMMM D, YYYY").format(
            "YYYY-MM-DD"
          ),
        }
      );

      this.needsResync = data?.forResync ? data.forResync : false;
    },

    async checkHasData() {
      this.hasData = 0;

      let payload = {
        limit: 1,
        date: moment(this.settlementDate, "MMMM D, YYYY").format("YYYY-MM-DD"),
      };

      const { data } = await this.$store.dispatch(
        "inward/getConsolidatedInwardBatch",
        payload
      );

      this.hasData = data ? 1 : -1;
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
                                            value="1"
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
        onOpenBefore: function() {
          this.$content.find(".modal-form-inward").validate({
            rules: {
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

          this.$content
            .find("input[name='settlementDate']")
            .val(vm.settlementDate);
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

                vm.$store.dispatch("scheduler/syncIndex", payload);

                JCinstance.setContent(
                  "Inward sync is running in the background. This may take a while."
                );

                const closeInstance = JCinstance.$$close;
                closeInstance.show();

                let timeOut = 5000;
                const buttonTxt = closeInstance.text();

                let intrvalInstance = setInterval(() => {
                  if (timeOut == 0) {
                    JCinstance.close();
                    clearInterval(intrvalInstance);
                  } else {
                    const seconds = timeOut / 1000;
                    closeInstance.text(`${buttonTxt} (${seconds})`);

                    timeOut -= 1000;
                  }
                }, 1000);
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

    reSync() {
      const vm = this;

      const payload = {
        settlementDate: moment(this.settlementDate, "MMMM D, YYYY").format(
          "YYYY-MM-DD"
        ),
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: "RE-SYNC INWARD",
        content: "",
        columnClass: "col-md-8",
        buttons: {
          resync: {
            text: "re-sync",
            btnClass: "btn-success",
            action() {
              let JCinstance = this;

              JCinstance.$$resync.hide();
              JCinstance.$$cancel.hide();

              JCinstance.setContent("Processing....");
              JCinstance.setIcon("fas fa-circle-notch fa-pulse");

              vm.$store.dispatch("inward/reSyncInward", payload);

              JCinstance.setContent(
                "Inward re-sync is running in the background. This may take a while."
              );

              const closeInstance = JCinstance.$$close;
              closeInstance.show();

              let timeOut = 5000;
              const buttonTxt = closeInstance.text();

              let intrvalInstance = setInterval(() => {
                if (timeOut == 0) {
                  JCinstance.close();
                  clearInterval(intrvalInstance);
                } else {
                  const seconds = timeOut / 1000;
                  closeInstance.text(`${buttonTxt} (${seconds})`);

                  timeOut -= 1000;
                }
              }, 1000);

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

    viewLogs() {
      this.viewLogsModal = 1;
    },
  },

  mounted() {
    const vm = this;

    const dp = $("input[name='inward_settlement_date']")
      .datepicker({
        autoClose: true,
        language: "en",
        toggleSelected: false,
        dateFormat: "MM d, yyyy",
        onSelect: async function(fd, d, picker) {
          vm.settlementDate = fd;
        },
      })
      .data("datepicker");

    const selectedDate = localStorage.getItem("InwardSettlementDate")
      ? moment(
          localStorage.getItem("InwardSettlementDate"),
          "MMMM D, YYYY"
        ).toDate()
      : moment().toDate();

    dp.selectDate(selectedDate);
  },

  created() {
    Promise.all([this.getLastSync(), this.getIsSyncing()]);

    this.sockets.subscribe("SchedulerSave", async (sockData) => {
      if (sockData.type == "SYNC INWARD") {
        let { data } = await this.$store.dispatch("scheduler/getLastSync", {
          type: "SYNC INWARD",
        });

        this.lastSync = data ? data.lastSync : "No data found.";
      }
    });

    this.sockets.subscribe("SchedulerTriggerSync", async (sockData) => {
      if (sockData.type == "inward") {
        await this.checkForResync();
        this.getIsSyncing();
      }
    });

    this.sockets.subscribe("InwardSave", async (sockData) => {
      if (this.hasData != 1) {
        let payload = {
          limit: 1,
          date: moment(this.settlementDate, "MMMM D, YYYY").format(
            "YYYY-MM-DD"
          ),
        };

        const { data } = await this.$store.dispatch(
          "inward/getConsolidatedInwardBatch",
          payload
        );

        this.hasData = data ? 1 : -1;
      }
    });
  },

  destroyed() {
    this.sockets.unsubscribe("SchedulerSave");
    this.sockets.unsubscribe("SchedulerTriggerSync");
    this.sockets.unsubscribe("InwardSave");
    localStorage.removeItem("InwardSettlementDate");
  },
};
</script>

<style scoped>
.manual-sync {
  cursor: pointer;
}

.centered-spinner {
  width: 100%;
  text-align: right;
}
</style>
