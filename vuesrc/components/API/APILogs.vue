<template>
  <div class="card mb-4">
    <div class="card-header">
      <div class="row">
        <div class="col-md-6"><b>API LOGS</b></div>

        <div class="col-md-2 offset-md-4">
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
              @input="searchLog()"
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
    <div v-if="logs.length == 0 && isLoading == 0">
      <div class="row">
        <div class="col-md-12 text-center no-data-found">
          <h1>No data found.</h1>
        </div>
      </div>
    </div>
    <div class="table-responsive" v-if="isLoading == 0 && logs.length > 0">
      <table class="table align-items-center table-flush">
        <thead class="thead-light">
          <tr>
            <th scope="col"><b>REFERENCE NUMBER</b></th>
            <th scope="col"><b>SENT BY</b></th>
            <th scope="col"><b>ENDPOINT</b></th>
            <th scope="col"><b>LOG</b></th>
            <th scope="col"><b>TIMESTAMP</b></th>
          </tr>
        </thead>
        <tbody class="list">
          <tr v-for="(log, key) in logs" :key="key">
            <td>{{ log.referenceId }}</td>
            <td>{{ log.sentBy }}</td>
            <td>{{ log.endpoint }}</td>
            <td>{{ log.log }}</td>
            <td>{{ log.createdAt }}</td>
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
          :click-handler="getLogs"
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

export default {
  components: {
    appLoader: Loader,
    appPagination: Paginate,
  },

  data() {
    return {
      isLoading: 1,
      logs: [],
      search: localStorage.getItem("APISearch") || "",
      pages: 0,
      page: +localStorage.getItem("APIPage") || 1,
      limit: 5,
    };
  },

  methods: {
    async searchLog() {
      this.page = 1;
      await this.getLogs();
    },

    async getLogs() {
      this.isLoading = 1;

      localStorage.setItem("APISearch", this.search);
      localStorage.setItem("APIPage", this.page);

      let payload = {
        page: this.page,
        limit: this.limit,
        search: this.search,
      };

      let { data, lastPage } = await this.$store.dispatch(
        "api/getLogs",
        payload
      );

      this.logs = data || [];
      this.pages = lastPage || 0;

      this.isLoading = 0;
    },
  },

  async created() {
    await this.getLogs();

    this.sockets.subscribe("APISave", async () => {
      let payload = {
        page: this.page,
        limit: this.limit,
        search: this.search,
      };

      let { data, lastPage } = await this.$store.dispatch(
        "api/getLogs",
        payload
      );

      this.logs = data || [];
      this.pages = lastPage || 0;
    });
  },

  destroyed() {
    this.sockets.unsubscribe("APISave");
    localStorage.removeItem("APISearch");
    localStorage.removeItem("APIPage");
  },
};
</script>
