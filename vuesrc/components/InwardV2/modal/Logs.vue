<template>
  <div
    class="modal fade"
    id="inward-logs-modal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="inward-logs-modal"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable mw-100"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title" id="modal-title-default">
            <b class="modal-title-section mr-2">LOGS</b>
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
          <div class="custom-loader-middle" v-if="isLoading == 1">
            <div class="row">
              <div class="col-md-12 pt-3 pb-3">
                <app-loader />
              </div>
            </div>
          </div>

          <div v-if="isLoading == 0 && logs.length == 0">
            <div class="row">
              <div class="col-md-12 text-center no-data-found">
                <h1>No data found.</h1>
              </div>
            </div>
          </div>

          <div
            class="timeline timeline-one-side"
            data-timeline-content="axis"
            data-timeline-axis-style="dashed"
            v-if="isLoading == 0 && logs.length > 0"
          >
            <div class="timeline-block" v-for="(log, idx) of logs" :key="idx">
              <span
                class="timeline-step"
                :class="getClasses('badge', log.action)"
              >
                <i :class="getClasses('icon', log.action)"></i>
              </span>
              <div class="timeline-content mw-100">
                <small class="font-weight-bold">{{
                  getTimestamp(log.timestamp)
                }}</small>
                <h5
                  class=" mt-3 mb-0 action-content"
                  :class="getClasses('text', log.action)"
                >
                  {{ log.action }}
                </h5>
                <p class=" text-sm mt-1 mb-0 text-content">
                  {{ log.description }}
                </p>

                <div v-if="log.transactions">
                  <span
                    class="badge px-2 has-cursor"
                    :class="getClasses('badge', log.action)"
                    data-toggle="collapse"
                    :data-target="`#log-collapse-${idx}`"
                    @click.prevent="toggleClick(idx)"
                    >{{ log.isClicked ? "SHOW LESS" : "SHOW MORE" }}</span
                  >
                  <div class="collapse" :id="`log-collapse-${idx}`">
                    <div
                      class="card card-body p-3 m-0 mt-2 collapse-content"
                      v-html="
                        readableTransactions(log.transactions, log.action)
                      "
                    ></div>
                  </div>
                </div>

                <div class="mt-3 credentials-content">
                  <span class="badge badge-pill badge-primary">{{
                    log.user.role
                  }}</span>
                  <span class="badge badge-pill badge-primary">{{
                    `(${log.user.username}) ${log.user.fullname}`
                  }}</span>
                </div>
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
      logs: [],
      isLoading: 1,
    };
  },

  props: ["viewLogsModal", "settlementDate"],

  watch: {
    async viewLogsModal(newVal, oldVal) {
      if (newVal == 1) {
        this.logs = [];

        this.getLogs();
        $("#inward-logs-modal").modal({
          backdrop: "static",
        });
      }
    },
  },

  methods: {
    closeModal() {
      $("#inward-logs-modal").modal("hide");
      this.$emit("update:viewLogsModal", 0);
    },

    getClasses(type, logType) {
      const classes = {
        badge: {
          sync: "badge-warning",
          "re-sync": "badge-warning",
          "update status": "badge-default",
          "reject status": "badge-danger",
          "send status": "badge-success",
          regenerate: "badge-primary",
          download: "badge-primary",
          "generate pdf": "badge-primary",
        },
        text: {
          sync: "text-danger",
          "re-sync": "text-danger",
          "update status": "text-default",
          "reject status": "text-warning",
          "send status": "text-success",
          regenerate: "text-primary",
          download: "text-primary",
          "generate pdf": "text-primary",
        },
        icon: {
          sync: "fas fa-sync-alt",
          "re-sync": "fas fa-sync-alt",
          "update status": "fas fa-edit",
          "reject status": "fas fa-comment-slash",
          "send status": "fas fa-clipboard-check",
          regenerate: "fas fa-folder-plus",
          download: "fas fa-download",
          "generate pdf": "far fa-file-pdf",
        },
      };

      return classes[type][logType.toLowerCase()];
    },

    getTimestamp(timestamp) {
      const tstamp = moment(timestamp, "x").format("MMMM D, YYYY h:hh:ss A");
      const readable = moment(timestamp, "x").fromNow();
      return `${readable} - ${tstamp}`;
    },

    readableTransactions(txns, type) {
      let html = "";

      if(type == "SEND STATUS") {
        if(txns.sent.length > 0) {
          html += ("<h2 class='text-success'>SUCCESSFULLY SENT:</h2>")
          html += txns.sent.join("<br>")
        }
          
        
        if(txns.failed.length){
          html += ("<h2 class='text-danger'>FAILED:</h2>")
          html += (`<h4>REMARKS: ${txns.remarks}</h4>`)
          html += txns.failed.join("<br>")
        }
      } else
        html = txns.join("<br>");

      return html;
    },

    toggleClick(idx) {
      this.logs[idx].isClicked = !this.logs[idx].isClicked;
    },

    async getLogs() {
      this.isLoading = 1;
      let payload = {
        settlementDate: moment(this.settlementDate, "MMMM D, YYYY").format(
          "YYYY-MM-DD"
        ),
      };

      const { status, data } = await this.$store.dispatch(
        "inward/getInwardConsolidatedLogs",
        payload
      );

      const logsFetch = data
        ? data.map((log) => {
            log.isClicked = false;

            return log;
          })
        : [];

      this.logs = logsFetch;
      this.isLoading = 0;
    },
  },
};
</script>

<style scoped>
#inward-logs-modal .modal-dialog {
  width: 40%;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
}

.credentials-content .badge {
  font-size: 80%;
}

.action-content {
  font-size: 20px;
}

.text-content {
  font-size: 1rem;
  color: black;
  font-weight: 500;
}

.timeline:before {
  border-right: 2px solid #ccc;
}

.has-cursor {
  cursor: pointer;
}

.collapse-content {
  font-weight: 600;
}
</style>
