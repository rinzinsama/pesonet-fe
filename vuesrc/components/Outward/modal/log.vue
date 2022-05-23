<template>
  <div
    class="modal fade"
    id="outward-log-modal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="outward-log-modal"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title" id="modal-title-default">
            <b class="modal-title-section mr-2"
              >TRANSACTION LOGS - {{ logId }}</b
            >
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
          <div v-if="isLoading == 1">
            <div class="row">
              <div class="col-md-12 pt-3 pb-3">
                <app-loader />
              </div>
            </div>
          </div>
          <div v-if="logs.length == 0 && isLoading == 0">
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
            v-if="logs.length > 0 && isLoading == 0"
          >
            <div class="timeline-block" v-for="(log, key) in logs" :key="key">
              <span class="timeline-step badge-danger">
                <i class="fas fa-mail-bulk"></i>
              </span>
              <div class="timeline-content">
                <small class="text-success font-weight-bold transaction-time">{{
                  log.createdAt
                }}</small>
                <h5 class=" mt-3 mb-0 transaction-status">
                  [{{ log.user }}{{ log.fullname ? ` ⬤ ${log.fullname}` : "" }}]
                  {{ log.remarks }}
                </h5>
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

export default {
  components: {
    appLoader: Loader,
  },

  data() {
    return {
      isLoading: 1,
      logs: [],
    };
  },

  props: ["viewOutwardLog", "logId"],

  watch: {
    async viewOutwardLog(newVal, oldVal) {
      if (newVal == 1) {
        $("#outward-log-modal").modal({
          backdrop: "static",
        });

        await this.getLogs();
      }
    },
  },

  methods: {
    closeModal() {
      $("#outward-log-modal").modal("hide");
      this.$emit("update:viewOutwardLog", 0);
    },

    async getLogs() {
      this.isLoading = 1;

      const payload = {
        referenceId: this.logId,
        type: "OUTWARD",
      };

      const { data, status } = await this.$store.dispatch(
        "transactionlog/getLogs",
        payload
      );

      this.logs = data || [];
      this.isLoading = 0;
    },
  },

  async created() {
    this.sockets.subscribe("PesonetTransactionSave", async () => {
      if (this.viewOutwardLog == 1) {
        const payload = {
          referenceId: this.logId,
          type: "OUTWARD",
        };

        const { data, status } = await this.$store.dispatch(
          "transactionlog/getLogs",
          payload
        );

        this.logs = data || [];
      }
    });
  },

  destroyed() {
    this.sockets.unsubscribe("PesonetTransactionSave");
  },
};
</script>
