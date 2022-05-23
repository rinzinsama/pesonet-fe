<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col-md-10">
          <button type="button" class="btn btn-success" @click="createStatus">
            CREATE STATUS
          </button>
        </div>
        <div div class="col-md-2 text-right">
          <select
            class="selectpicker ignore justify-content-end"
            data-style="btn-danger"
            data-width="100%"
            v-model="type"
            @change="searchStatus()"
          >
            <option value="0">All</option>
            <option v-for="(type, key) in types" :value="type.id" :key="key">{{
              type.type
            }}</option>
            <option value="-1">Inactive</option>
          </select>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-2 offset-md-10">
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
              @input="searchStatus()"
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
    <div v-if="lists.length == 0 && isLoading == 0">
      <div class="row">
        <div class="col-md-12 text-center no-data-found">
          <h1>No data found.</h1>
        </div>
      </div>
    </div>
    <div class="table-responsive" v-if="isLoading == 0 && lists.length > 0">
      <table class="table align-items-center table-flush">
        <thead class="thead-light">
          <tr>
            <th scope="col"><b>REFERENCE NUMBER</b></th>
            <th scope="col"><b>STATUS CODE</b></th>
            <th scope="col"><b>STATUS NAME</b></th>
            <th scope="col"><b>TYPE</b></th>
            <th scope="col"><b>ACTION</b></th>
          </tr>
        </thead>
        <tbody class="list">
          <tr v-for="(list, key) in lists" :key="key">
            <td>{{ list.referenceId }}</td>
            <td>{{ list.statusCode }}</td>
            <td>{{ list.statusName }}</td>
            <td>{{ list.type }}</td>
            <td>
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click.prevent="updateStatus(list.referenceId)"
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
          :click-handler="getLists"
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
      lists: [],
      type: localStorage.getItem("StatusListFilter") || 0,
      types: [],
      search: localStorage.getItem("StatusListSearch") || "",
      pages: 0,
      page: +localStorage.getItem("StatusListPage") || 1,
      limit: 8,
    };
  },

  watch: {
    types: function(newVal) {
      this.$nextTick(() => $(".selectpicker").selectpicker("refresh"));
    },
  },

  methods: {
    createStatus() {
      this.$router.push({ name: "Create Status" });
    },

    updateStatus(id) {
      this.$router.push({ name: "Update Status", params: { id } });
    },

    async searchStatus() {
      this.page = 1;
      await this.getLists();
    },

    async getLists() {
      this.isLoading = 1;

      localStorage.setItem("StatusListFilter", this.type);
      localStorage.setItem("StatusListSearch", this.search);
      localStorage.setItem("StatusListPage", this.page);

      let payload = {
        filter: this.type,
        page: this.page,
        limit: this.limit,
        search: this.search,
      };

      let { data, lastPage } = await this.$store.dispatch(
        "statuslist/getLists",
        payload
      );

      this.lists = data || [];
      this.pages = lastPage || 0;

      this.isLoading = 0;
    },

    async getTypes() {
      const { data } = await this.$store.dispatch("statustype/getTypes");

      this.types = data || [];

      await this.getLists();
    },
  },

  async created() {
    await this.getTypes();

    this.sockets.subscribe("StatusListSave", async () => {
      let payload = {
        filter: this.type,
        page: this.page,
        limit: this.limit,
        search: this.search,
      };

      let { data, lastPage } = await this.$store.dispatch(
        "statuslist/getLists",
        payload
      );

      this.lists = data || [];
      this.pages = lastPage || 0;
    });
  },

  destroyed() {
    this.sockets.unsubscribe("StatusListSave");
    localStorage.removeItem("StatusListFilter");
    localStorage.removeItem("StatusListSearch");
    localStorage.removeItem("StatusListPage");
  },
};
</script>

<style scoped>
th {
  width: 16.66%;
}
</style>
