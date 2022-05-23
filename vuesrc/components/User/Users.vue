<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col-md-10">
          <button type="button" class="btn btn-success" @click="createUser">
            CREATE USER
          </button>
        </div>
        <div div class="col-md-2 text-right">
          <select
            class="selectpicker ignore justify-content-end"
            data-style="btn-danger"
            data-width="100%"
            v-model="role"
            @change="searchUser()"
          >
            <option value="0">Active</option>
            <option v-for="(role, key) in roles" :value="role.id" :key="key">{{
              role.role
            }}</option>
            <option value="-1">Locked</option>
            <option value="-2">Banned</option>
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
              @input="searchUser()"
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
    <div v-if="users.length == 0 && isLoading == 0">
      <div class="row">
        <div class="col-md-12 text-center no-data-found">
          <h1>No data found.</h1>
        </div>
      </div>
    </div>
    <div class="table-responsive" v-if="isLoading == 0 && users.length > 0">
      <table class="table align-items-center table-flush">
        <thead class="thead-light">
          <tr>
            <th scope="col"><b>REFERENCE NUMBER</b></th>
            <th scope="col"><b>USERNAME</b></th>
            <th scope="col"><b>NAME</b></th>
            <th scope="col"><b>EMAIL</b></th>
            <th scope="col"><b>ROLE</b></th>
            <th scope="col"><b>ACTION</b></th>
          </tr>
        </thead>
        <tbody class="list">
          <tr v-for="(user, key) in users" :key="key">
            <td>{{ user.referenceId }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.fullname }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click.prevent="updateUser(user.referenceId)"
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
          :click-handler="getUsers"
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
      users: [],
      role: localStorage.getItem("UserManagementFilter") || 0,
      roles: [],
      search: localStorage.getItem("UserManagementSearch") || "",
      pages: 0,
      page: +localStorage.getItem("UserManagementPage") || 1,
      limit: 8,
    };
  },

  watch: {
    roles: function(newVal) {
      this.$nextTick(() => $(".selectpicker").selectpicker("refresh"));
    },
  },

  methods: {
    createUser() {
      this.$router.push({ name: "Create User" });
    },

    updateUser(id) {
      this.$router.push({ name: "Update User", params: { id } });
    },

    async searchUser() {
      this.page = 1;
      await this.getUsers();
    },

    async getUsers() {
      this.isLoading = 1;

      localStorage.setItem("UserManagementFilter", this.role);
      localStorage.setItem("UserManagementSearch", this.search);
      localStorage.setItem("UserManagementPage", this.page);

      let payload = {
        filter: this.role,
        page: this.page,
        limit: this.limit,
        search: this.search,
      };

      let { data, lastPage } = await this.$store.dispatch(
        "user/getUsers",
        payload
      );

      this.users = data || [];
      this.pages = lastPage || 0;

      this.isLoading = 0;
    },

    async getRoles() {
      const { data } = await this.$store.dispatch("role/getRoles");

      this.roles = data || [];

      await this.getUsers();
    },
  },

  async created() {
    await this.getRoles();

    this.sockets.subscribe("UserManagementSave", async () => {
      let payload = {
        filter: this.role,
        page: this.page,
        limit: this.limit,
        search: this.search,
      };

      let { data, lastPage } = await this.$store.dispatch(
        "user/getUsers",
        payload
      );

      this.users = data || [];
      this.pages = lastPage || 0;
    });
  },

  destroyed() {
    this.sockets.unsubscribe("UserManagementSave");
    localStorage.removeItem("UserManagementFilter");
    localStorage.removeItem("UserManagementSearch");
    localStorage.removeItem("UserManagementPage");
  },
};
</script>

<style scoped>
th {
  width: 16.66%;
}
</style>
