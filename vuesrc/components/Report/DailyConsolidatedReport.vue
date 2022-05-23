<template>
  <div class="card mb-4">
    <div class="card-header">
      <button type="button" class="btn btn-warning" @click="goBack">
        BACK
      </button>
    </div>
    <div class="card-body">
      <form class="inward-transactions-report-form">
        <div class="row">
          <div class="col-md-4">
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
          <div class="col-md-4">
            <button
              type="button"
              class="btn btn-success"
              @click="generateData"
              :disabled="isDisabled"
            >
              GENERATE
            </button>
          </div>
          <div
            class="col-md-4 text-right"
            v-if="isLoading == 0 && transactions.length > 0"
          >
            <button
              type="button"
              class="btn btn-danger"
              @click="generatePDF"
              :disabled="isDisabled"
            >
              PDF
            </button>
          </div>
        </div>

        <div v-if="isLoading == 1">
          <div class="row">
            <div class="col-md-12 pt-3 pb-3">
              <app-loader />
            </div>
          </div>
        </div>

        <div
          v-if="transactions.length == 0 && isLoading == 0 && isTriggered == 1"
        >
          <div class="row">
            <div class="col-md-12 text-center no-data-found">
              <h1>No data found.</h1>
            </div>
          </div>
        </div>

        <div class="mt-4" v-if="isLoading == 0 && transactions.length > 0">
          <div class="row">
            <div class="col">
              <h1>DAILY CONSOLIDATED REPORT - {{ date }}</h1>
            </div>
          </div>
          <div
            class="table-responsive"
            v-if="isLoading == 0 && transactions.length > 0"
          >
            <table class="table align-items-center table-flush">
              <thead class="thead-light">
                <tr>
                  <th scope="col"><b>BANK NAME</b></th>
                  <th scope="col" class="text-center"><b>OUTWARD COUNT</b></th>
                  <th scope="col" class="text-center"><b>LOSS (DEBIT)</b></th>
                  <th scope="col" class="text-center"><b>INWARD COUNT</b></th>
                  <th scope="col" class="text-center"><b>WIN (CREDIT)</b></th>
                </tr>
              </thead>
              <tbody class="list">
                <tr v-for="(transaction, key) in transactions" :key="key">
                  <td>{{ transaction.bankName }}</td>
                  <td class="text-right">
                    {{ transaction.outwardCount || "" }}
                  </td>
                  <td class="text-right">
                    {{
                      transaction.loss
                        ? `${parseAmount(transaction.loss)}-`
                        : ""
                    }}
                  </td>
                  <td class="text-right">
                    {{ transaction.inwardCount || "" }}
                  </td>
                  <td class="text-right">
                    {{
                      transaction.win ? `${parseAmount(transaction.win)}+` : ""
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="text-center large-text">TOTAL</td>
                  <td class="text-right">{{ outwardTotal }}</td>
                  <td class="text-right">{{ lossTotal }}-</td>
                  <td class="text-right">{{ inwardTotal }}</td>
                  <td class="text-right">{{ winTotal }}+</td>
                </tr>
                <tr>
                  <td class="text-center large-text">NET SETTLEMENT</td>
                  <td class="text-right"></td>
                  <td class="text-right">{{ netSettlement.netLoss }}-</td>
                  <td class="text-right"></td>
                  <td class="text-right">{{ netSettlement.netWin }}+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Loader from "../master/Loader";
import { saveAs } from "file-saver";
import { mapGetters } from "vuex";

export default {
  components: {
    appLoader: Loader,
  },

  data() {
    return {
      isTriggered: 0,
      isLoading: 0,
      date: "",
      transactions: [],
    };
  },

  computed: {
    isDisabled() {
      return this.isLoading ? true : false;
    },

    outwardTotal() {
      let total = 0;

      this.transactions.forEach((txn) => {
        total += +txn.outwardCount || 0;
      });

      return total;
    },

    inwardTotal() {
      let total = 0;

      this.transactions.forEach((txn) => {
        total += +txn.inwardCount || 0;
      });

      return total;
    },

    lossTotal() {
      let total = 0;

      this.transactions.forEach((txn) => {
        total += +txn.loss || 0;
      });

      return this.parseAmount(total);
    },

    winTotal() {
      let total = 0;

      this.transactions.forEach((txn) => {
        total += +txn.win || 0;
      });

      return this.parseAmount(total);
    },

    isWin() {
      const win = `${this.winTotal}`.replace(/,/g, "");
      const loss = `${this.lossTotal}`.replace(/,/g, "");
      return +win > +loss;
    },

    isLoss() {
      const win = `${this.winTotal}`.replace(/,/g, "");
      const loss = `${this.lossTotal}`.replace(/,/g, "");
      return +loss > +win;
    },

    netSettlement() {
      let netWin = 0;
      let netLoss = 0;
      const win = `${this.winTotal}`.replace(/,/g, "");
      const loss = `${this.lossTotal}`.replace(/,/g, "");

      if (this.isWin) netWin = +win - +loss;

      if (this.isLoss) netLoss = +loss - +win;
      
      return {
        netLoss: this.parseAmount(netLoss),
        netWin: this.parseAmount(netWin),
      };
    },

    ...mapGetters({
      apiBaseUrl: "getApiBaseUrl",
    }),
  },

  methods: {
    goBack() {
      this.$router.push({ name: "Report" });
    },

    parseAmount(amount) {
      const amt = `${amount}`.replace(/,/g, "");

      return (+amt).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    },

    async generateData() {
      if (this.date.length == 0) {
        this.$popover({
          icon: "fas fa-exclamation-triangle",
          title: "Warning!",
          content: `Please select a date!`,
          buttons: {
            ok: {
              text: "ok",
              btnClass: "btn-success",
              keys: ["enter"],
            },
          },
        });

        return;
      }

      this.isLoading = 1;

      const { data } = await this.$store.dispatch(
        "report/GeneratePesonetReport",
        {
          date: moment(this.date, "MMMM D, YYYY").format("YYYY-MM-DD"),
        }
      );

      this.transactions = data || [];

      this.isTriggered = 1;
      this.isLoading = 0;
    },

    async generatePDF() {
      const vm = this;

      this.$popover({
        icon: "fas fa-circle-notch fa-pulse",
        title: "GENERATING PDF...",
        content: "",
        onOpenBefore: function() {
          $(this.$contentPane).remove();
        },
        onContentReady: function() {
          vm.$store
            .dispatch("report/generatePesonetReportPDF", {
              transactions: vm.transactions,
              date: vm.date,
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
  },

  mounted() {
    const vm = this;

    $("input[name='date']").datepicker({
      autoClose: true,
      language: "en",
      toggleSelected: false,
      dateFormat: "MM d, yyyy",
      onSelect: async function(fd, d, picker) {
        vm.date = fd;

        if (vm.firstLoad == 0) await vm.searchOutwardBatch();
      },
    });
  },
};
</script>

<style scoped>
tr td:first-child {
  width: 30%;
}

tr td:nth-child(2),
tr td:nth-child(4) {
  width: 10%;
}

tr td:nth-child(3),
tr td:nth-child(5) {
  width: 25%;
}

.large-text {
  font-size: 25px !important;
}
</style>
