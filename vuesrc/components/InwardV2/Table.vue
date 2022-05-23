<template>
  <div class="min-vw-50">
    <div class="card-header border-0 pb-0">
      <div class="row align-items-center">
        <div class="col-md-2 text-danger">
          <b class="header-labels">INWARD BATCHES</b>
        </div>
        <div div class="col-md-2 offset-md-8 text-right" v-if="isLoading == 0">
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
      <div class="row align-items-center mt-4 pb-2">
        <div class="col-md-6">
          <b
            >TOTAL NUMBER OF TRANSACTIONS:
            <span class="text-success">{{ totalNumberOftransactions }}</span>
          </b>
        </div>
        <div class="col-md-6 text-right">
          <b
            >TOTAL AMOUNT:
            <span class="text-success">{{ parseAmount(totalAmount) || "0.00" }}</span>
          </b>
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

    <div v-if="isLoading == 0 && batches.length == 0">
      <div class="row">
        <div class="col-md-12 text-center no-data-found">
          <h1>No data found.</h1>
        </div>
      </div>
    </div>

    <div v-if="isLoading == 0 && batches.length > 0">
      <div class="table-responsive">
        <table class="table align-items-center table-flush">
          <thead class="thead-light">
            <tr>
              <th scope="col"><b>SEQUENCE NUMBER</b></th>
              <th scope="col"><b>NO. OF TRANSACTIONS</b></th>
              <th scope="col"><b>TOTAL AMOUNT</b></th>
            </tr>
          </thead>
          <tbody class="list">
            <tr v-for="(batch, key) in batches" :key="key">
              <td>{{ batch.sequenceNumber }}</td>
              <td>{{ batch.numberOfTransaction || "" }}</td>
              <td>{{ parseAmount(batch.totalAmount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-footer py-4" v-if="pages > 1">
        <nav aria-label="...">
          <app-pagination
            v-show="pages > 1"
            :page-count="pages"
            :container-class="'pagination justify-content-end mb-0'"
            v-model="page"
            :click-handler="getHeaders"
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
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Loader from "../master/Loader";
import Paginate from "vuejs-paginate";

export default {
  components: {
    appPagination: Paginate,
    appLoader: Loader,
  },

  props: ["settlementDate"],

  data() {
    return {
      isLoading: 1,
      batches: [],
      page: +localStorage.getItem("InwardPage") || 1,
      pages: 0,
      limit: 5,
      search: localStorage.getItem("InwardSearch") || "",
      totalAmount: 0,
      totalNumberOftransactions: 0,
    };
  },

  watch: {
    settlementDate: {
      immediate: true,
      async handler(newVal, oldVal) {
        await this.getConsolidatedTotals();
        this.getHeaders();
      },
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

    async searchInwardBatch() {
      this.page = 1;
      await this.getHeaders();
    },

    async getHeaders() {
      this.isLoading = 1;

      localStorage.setItem("InwardSearch", this.search);
      localStorage.setItem("InwardPage", this.page);

      let payload = {
        page: this.page,
        limit: this.limit,
        search: this.search,
        date: moment(this.settlementDate, "MMMM D, YYYY").format("YYYY-MM-DD"),
      };

      const { status, data, lastPage } = await this.$store.dispatch(
        "inward/getConsolidatedInwardBatch",
        payload
      );

      this.batches = data ? data : [];
      this.pages = lastPage || 0;

      this.isLoading = 0;
    },

    async getConsolidatedTotals() {
      let payload = {
        settlementDate: moment(this.settlementDate, "MMMM D, YYYY").format(
          "YYYY-MM-DD"
        ),
      };

      const { totalCount, totalAmount } = await this.$store.dispatch(
        "inward/getConsolidatedTotals",
        payload
      );

      this.totalNumberOftransactions = totalCount;
      this.totalAmount = totalAmount;
    },
  },

  created() {
    this.sockets.subscribe("InwardSave", async (sockData) => {
      let consolidatedTotalPayload = {
        settlementDate: moment(this.settlementDate, "MMMM D, YYYY").format(
          "YYYY-MM-DD"
        ),
      };

      let payload = {
        page: this.page,
        limit: this.limit,
        search: this.search,
        date: moment(this.settlementDate, "MMMM D, YYYY").format("YYYY-MM-DD"),
      };

      const { totalCount, totalAmount } = await this.$store.dispatch(
        "inward/getConsolidatedTotals",
        consolidatedTotalPayload
      );

      let { data, lastPage } = await this.$store.dispatch(
        "inward/getConsolidatedInwardBatch",
        payload
      );

      this.totalNumberOftransactions = totalCount;
      this.totalAmount = totalAmount;
      this.batches = data ? data : [];
      this.pages = lastPage || 0;
    });
  },

  destroyed() {
    this.sockets.unsubscribe("InwardSave");
    localStorage.removeItem("InwardPage");
    localStorage.removeItem("InwardSearch");
  },
};
</script>

<style scoped>
td {
  width: 33.33%;
}

.header-labels {
  font-size: 25px;
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
