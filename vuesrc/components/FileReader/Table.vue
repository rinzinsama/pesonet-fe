<template>
  <div>
    <div class="filter-section">
      <div class="row">
        <div div class="col-md-2 text-right">
          <select
            class="selectpicker ignore justify-content-end"
            data-style="btn-danger"
            data-width="100%"
            v-model="status"
            @change="searchTransaction()"
          >
            <option value="0">All</option>
            <option value="1">Processed</option>
            <option value="-1">Invalid</option>
            <option value="-2">Failed</option>
            <option value="-3">Busy</option>
          </select>
        </div>
        <div class="col-md-2 offset-md-8">
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
            <th scope="col"><b>FILENAME</b></th>
            <th scope="col"><b>REMARKS</b></th>
            <th scope="col"><b>STATUS</b></th>
            <th scope="col"><b>TIMESTAMP</b></th>
            <th scope="col"><b>ACTION</b></th>
          </tr>
        </thead>
        <tbody class="list">
          <tr v-for="(txn, key) in transactions" :key="key">
            <td>{{ txn.referenceId }}</td>
            <td>{{ txn.filename }}</td>
            <td>{{ txn.remarks }}</td>
            <td
              :class="{
                'cell-danger': txn.status != 1,
                'cell-success': txn.status == 1,
              }"
            >
              {{ getStatusMessage(txn.status) }}
            </td>
            <td>{{ txn.createdAt }}</td>
            <td>
              <button
                v-if="txn.status == 1"
                type="button"
                class="btn btn-danger btn-sm"
                @click.prevent="downloadFile(txn.referenceId)"
              >
                DOWNLOAD
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
          :click-handler="getTransactions"
          v-model="page"
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
</template>

<script>
import Loader from "../master/Loader";
import Paginate from "vuejs-paginate";
import { saveAs } from "file-saver";

export default {
  components: {
    appLoader: Loader,
    appPagination: Paginate,
  },

  data() {
    return {
      isLoading: 0,
      transactions: [],
      search: "",
      pages: 0,
      page: +localStorage.getItem("FileReaderPage") || 1,
      limit: 8,
      search: localStorage.getItem("FileReaderSearch") || "",
      status: localStorage.getItem("FileReaderStatus") || 0,
    };
  },

  methods: {
    async searchTransaction() {
      this.page = 1;
      await this.getTransactions();
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

    async getTransactions() {
      this.isLoading = 1;

      localStorage.setItem("FileReaderStatus", this.status);
      localStorage.setItem("FileReaderSearch", this.search);
      localStorage.setItem("FileReaderPage", this.page);

      let payload = {
        status: this.status,
        page: this.page,
        limit: this.limit,
        search: this.search,
      };

      let { data, lastPage } = await this.$store.dispatch(
        "reader/getLogs",
        payload
      );

      this.transactions = data || [];
      this.pages = lastPage || 0;

      this.isLoading = 0;
    },

    getStatusMessage(status) {
      let message = "";

      if (status == 1) message = "Processed";
      else if (status == -1) message = "Invalid";
      else if (status == -2) message = "Failed";
      else message = "Busy";

      return message;
    },
  },

  mounted() {
    $(".selectpicker").selectpicker("refresh");
  },

  async created() {
    await this.getTransactions();

    this.sockets.subscribe("FileReaderTransactions", async () => {
      let payload = {
        status: this.status,
        page: this.page,
        limit: this.limit,
        search: this.search,
      };

      let { data, lastPage } = await this.$store.dispatch(
        "reader/getLogs",
        payload
      );

      this.transactions = data || [];
      this.pages = lastPage || 0;
    });
  },

  destroyed() {
    this.sockets.unsubscribe("FileReaderTransactions");
    localStorage.removeItem("FileReaderStatus");
    localStorage.removeItem("FileReaderSearch");
    localStorage.removeItem("FileReaderPage");
  },
};
</script>

<style scoped>
td {
  width: 18%;
}

.filter-section {
  padding: 1.25rem 1.5rem;
}

.cell-danger {
  color: #fa3a0e;
}

.cell-success {
  color: #2dce89;
}
</style>
