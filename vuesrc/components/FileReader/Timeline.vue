<template>
  <div>
    <div class="filter-section">
      <div class="row">
        <div class="col-md-2">
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
      </div>
    </div>
    <div class="card-body">
      <div v-if="isLoading == 1">
        <div class="row">
          <div class="col-md-12 pt-3 pb-3">
            <app-loader />
          </div>
        </div>
      </div>
      <div v-if="transactions.length == 0 && isLoading == 0">
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
        v-if="transactions.length > 0 && isLoading == 0"
      >
        <div
          class="timeline-block"
          v-for="(txn, key) in transactions"
          :key="key"
        >
          <span
            class="timeline-step"
            :class="{
              'badge-success': txn.status == 1,
              'badge-danger': txn.status != 1,
            }"
          >
            <i class="fas fa-user-cog"></i>
          </span>
          <div class="timeline-content">
            <small class="text-info font-weight-bold transaction-time">{{
              txn.createdAt
            }}</small>
            <h5
              class=" mt-3 mb-0 transaction-status"
              :class="{
                'status-success': txn.status == 1,
                'status-fail': txn.status != 1,
              }"
            >
              {{ getStatusMessage(txn.status) }}
            </h5>
            <p class=" text-sm mt-1 mb-0 transaction-details">
              Reference Number: {{ txn.referenceId }}
              <br />
              Filename: {{ txn.filename }}
              <br />
              Remarks: {{ txn.remarks }}
            </p>
            <button
              v-if="txn.status == 1"
              type="button"
              class="btn btn-danger btn-sm mt-1"
              @click.prevent="downloadFile(txn.referenceId)"
            >
              DOWNLOAD
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Loader from "../master/Loader";

export default {
  components: {
    appLoader: Loader,
  },

  data() {
    return {
      isLoading: 0,
      date: "",
      transactions: [],
    };
  },

  watch: {
    async date(newVal) {
      await this.getData();
    },
  },

  methods: {
    getStatusMessage(status) {
      let message = "";

      if (status == 1) message = "Processed";
      else if (status == -1) message = "Invalid";
      else if (status == -2) message = "Failed";
      else message = "Busy";

      return message;
    },

    async downloadFile(referenceId) {
      let data = await this.$store.dispatch("reader/downloadGeneratedFile", {
        referenceId,
      });

      if (data instanceof Blob) saveAs(data, `${referenceId}.zip`);
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

    async getData() {
      this.isLoading = 1;

      let payload = {
        date: moment(this.date, "MMMM D, YYYY").format("YYYY-MM-DD"),
      };

      let { data } = await this.$store.dispatch(
        "reader/getLogsByDate",
        payload
      );

      this.transactions = data || [];

      this.isLoading = 0;
    },
  },

  mounted() {
    const vm = this;

    let datepicker = $("input[name='date']")
      .datepicker({
        autoClose: true,
        language: "en",
        toggleSelected: false,
        dateFormat: "MM d, yyyy",
        onSelect: function(fd, d, picker) {
          localStorage.setItem("FileReaderDate", fd);
          vm.date = fd;
        },
      })
      .data("datepicker");

    const date = localStorage.getItem("FileReaderDate")
      ? moment(localStorage.getItem("FileReaderDate"), "MMMM D, YYYY").toDate()
      : moment().toDate();

    datepicker.selectDate(date);
  },

  created() {
    this.sockets.subscribe("FileReaderTransactions", async () => {
      let payload = {
        date: moment(this.date, "MMMM D, YYYY").format("YYYY-MM-DD"),
      };

      let { data } = await this.$store.dispatch(
        "reader/getLogsByDate",
        payload
      );

      this.transactions = data || [];
    });
  },

  destroyed() {
    this.sockets.unsubscribe("FileReaderTransactions");
    localStorage.removeItem("FileReaderDate");
  },
};
</script>

<style scoped>
.filter-section {
  padding: 1.25rem 1.5rem;
}

input[name="date"] {
  text-align: right;
}

.transaction-time {
  font-size: 15px;
}

.transaction-details {
  font-weight: bold;
}

.transaction-status {
  font-size: 20px;
}

.timeline:before {
  border-right: 2px solid #11cdef;
}

.status-success {
  color: #2dce89;
}

.status-fail {
  color: #f5365c;
}
</style>
