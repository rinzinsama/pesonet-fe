<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row mt">
        <div div class="col-md-2">
          <select
            class="selectpicker ignore justify-content-end"
            data-style="btn-danger"
            data-width="100%"
            v-model="filter"
          >
            <option value="0">All</option>
            <option value="INWARD">INWARD</option>
            <option value="OUTWARD">OUTWARD</option>
            <option value="2">FILTER BY DATE</option>
          </select>
        </div>
        <div class="col-md-3" v-if="filter == 2">
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
          :class="filter == 2 ? 'offset-md-5' : 'offset-md-8'"
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
              @input="searchTransaction()"
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
    <div v-if="transactions.length == 0 && isLoading == 0">
      <div class="row">
        <div class="col-md-12 text-center no-data-found">
          <h1>No data found.</h1>
        </div>
      </div>
    </div>
    <div
      class="table-responsive"
      v-if="isLoading == 0 && transactions.length > 0"
    >
      <table class="table align-items-center table-flush">
        <thead class="thead-light">
          <tr>
            <th scope="col"><b>REFERENCE NUMBER</b></th>
            <th scope="col"><b>SEQUENCE NUMBER</b></th>
            <th scope="col"><b>SETTLEMENT DATE</b></th>
            <th scope="col"><b>AMOUNT</b></th>
            <th scope="col"><b>TYPE</b></th>
            <th scope="col"><b>ACTION</b></th>
          </tr>
        </thead>
        <tbody class="list">
          <tr v-for="(trans, key) in transactions" :key="key">
            <td>{{ trans.ofiReferenceNumber }}</td>
            <td>{{ trans.sequenceNumber }}</td>
            <td>{{ trans.settlementDate }}</td>
            <td>{{ parseAmount(trans.amount) }}</td>
            <td>{{ trans.type }}</td>
            <td>
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click.prevent="viewDetails(trans)"
              >
                VIEW DETAILS
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
          :click-handler="getTransactionList"
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
    <app-transaction-modal
      :viewTransactionModal.sync="viewTransactionModal"
      :reference="ref"
    />
  </div>
</template>

<script>
import Loader from "../master/Loader";
import Paginate from "vuejs-paginate";
import moment from "moment";
import TransactionModal from "./modal/index";

export default {
  components: {
    appLoader: Loader,
    appPagination: Paginate,
    appTransactionModal: TransactionModal,
  },

  data() {
    return {
      firstLoad: 1,
      isLoading: 1,
      transactions: [],
      viewTransactionModal: 0,
      ref: {},
      filter: 0,
      date: localStorage.getItem("TransactionListDate") || "",
      search: localStorage.getItem("TransactionListSearch") || "",
      pages: 0,
      page: +localStorage.getItem("TransactionListPage") || 1,
      limit: 8,
    };
  },

  watch: {
    filter: {
      immediate: true,
      handler(newVal, oldVal) {
        if (this.firstLoad == 0) this.date = "";
        if (this.firstLoad == 0 && newVal != 2) this.searchTransaction();

        if (newVal == 2) this.initializeDatepicker();
      },
    },

    date(newVal, oldVal) {
      localStorage.setItem("TransactionListDate", newVal);
    },

    viewTransactionModal(newVal, oldVal) {
      if (newVal == 0) this.ref = {};
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

    async searchTransaction() {
      this.page = 1;
      await this.getTransactionList();
    },

    async getTransactionList() {
      this.isLoading = 1;

      localStorage.setItem("TransactionListFilter", this.filter);
      localStorage.setItem("TransactionListSearch", this.search);
      localStorage.setItem("TransactionListPage", this.page);

      let payload = {
        page: this.page,
        limit: this.limit,
        search: this.search,
        filter: `${this.filter}`,
        date: this.date
          ? moment(this.date, "MMMM D, YYYY").format("YYYY-MM-DD")
          : "",
      };

      const { status, data, lastPage } = await this.$store.dispatch(
        "transactionlist/getTransactionList",
        payload
      );

      this.transactions = data ? data : [];
      this.pages = lastPage || 0;

      this.isLoading = 0;
      this.firstLoad = 0;
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

              if (vm.firstLoad == 0) await vm.searchTransaction();
            },
          })
          .data("datepicker");

        if (vm.date && vm.firstLoad == 1)
          dp.selectDate(moment(vm.date, "MMMM D, YYYY").toDate());
      });
    },

    async viewDetails(data) {
      this.ref = data;
      this.viewTransactionModal = 1;
    },
  },

  mounted() {
    $(".selectpicker").selectpicker("refresh");
  },

  async created() {
    this.filter = localStorage.getItem("TransactionListFilter") || "0";

    await this.getTransactionList();

    this.sockets.subscribe("TransactionListSave", async (sockData) => {
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
        "transactionlist/getTransactionList",
        payload
      );

      this.transactions = data ? data : [];
      this.pages = lastPage || 0;
    });
  },

  destroyed() {
    this.sockets.unsubscribe("TransactionListSave");
    localStorage.removeItem("TransactionListDate");
    localStorage.removeItem("TransactionListFilter");
    localStorage.removeItem("TransactionListSearch");
    localStorage.removeItem("TransactionListPage");
  },
};
</script>
