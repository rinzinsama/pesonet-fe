<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h2 class="text-info" v-if="!isLoading">
            LAST SYNC
            <i
              class="fas fa-sync-alt text-danger ml-2 manual-sync"
              @click="manualSync"
            ></i>
          </h2>
          <app-loader v-if="isLoading" class="m-0" />
          <b v-if="!isLoading">{{ lastSync }}</b>
        </div>
        <div div class="col-md-2 offset-md-4 text-right">
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
            />
          </div>
        </div>
      </div>
      <div class="row align-items-center">
        <div div class="col-md-2 offset-md-10 text-right">
          <select
            class="selectpicker ignore justify-content-end"
            data-style="btn-danger"
            data-width="100%"
            v-model="status"
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
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
    <div v-if="banks.length == 0 && isLoading == 0">
      <div class="row">
        <div class="col-md-12 text-center no-data-found">
          <h1>No data found.</h1>
        </div>
      </div>
    </div>
    <div class="table-responsive" v-if="isLoading == 0 && banks.length > 0">
      <table class="table align-items-center table-flush">
        <thead class="thead-light">
          <tr>
            <th scope="col"><b>BIC</b></th>
            <th scope="col"><b>BANK NAME</b></th>
            <th scope="col"><b>PCHC BANK CODE</b></th>
            <th scope="col"><b>HEAD OFFICE BRSTN</b></th>
            <th scope="col"><b>STATUS</b></th>
          </tr>
        </thead>
        <tbody class="list">
          <tr v-for="(bank, key) in bankList" :key="key">
            <td>{{ bank.BICFI }}</td>
            <td>{{ bank.bank_name }}</td>
            <td>{{ bank.pchc.bank_code }}</td>
            <td>{{ bank.pchc.head_office_brstn }}</td>
            <td :class="getStatusClass(bank.active)">
              {{ getStatusMessage(bank.active) }}
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
      banks: [],
      status: 1,
      lastSync: "No data found.",
      search: localStorage.getItem("BankListSearch") || "",
      pages: 0,
      page: +localStorage.getItem("BankListPage") || 1,
      limit: 8,
    };
  },

  watch: {
    search() {
      this.page = 1;
    },
  },

  computed: {
    bankList() {
      localStorage.setItem("BankListSearch", this.search);
      localStorage.setItem("BankListPage", this.page);

      let clonedBank = this.banks.filter((bank) => {
        const regex = new RegExp(this.search, "i");
        const status = this.status == 1 ? true : false;

        return (
          (regex.test(bank.BICFI) ||
            regex.test(bank.bank_name) ||
            regex.test(bank.pchc.bank_code) ||
            regex.test(bank.pchc.head_office_brstn)) &&
          bank.active == status
        );
      });
      this.pages = Math.floor(clonedBank.length / +this.limit);

      return clonedBank.slice(
        (this.page - 1) * this.limit,
        this.page * this.limit
      );
    },
  },

  methods: {
    getStatusClass(status) {
      return Boolean(status) ? "cell-success" : "cell-danger";
    },

    getStatusMessage(status) {
      return Boolean(status) ? "ACTIVE" : "INACTIVE";
    },

    async getBankList() {
      this.isLoading = 1;

      let [
        { status: bankListStatus, data: bankListData },
        { status: lastSyncStatus, data: lastSyncData },
      ] = await Promise.all([
        await this.$store.dispatch("banklist/getBankList"),
        await this.$store.dispatch("scheduler/getLastSync", {
          type: "SYNC BANK LIST",
        }),
      ]);

      this.banks = bankListData ? bankListData.PESONetMemberBanks : [];
      this.lastSync = lastSyncData ? lastSyncData.lastSync : "No data found.";

      this.isLoading = 0;
    },

    async manualSync() {
      const vm = this;

      this.$popover({
        icon: "fas fa-circle-notch fa-pulse",
        title: "SYNC BANK LIST",
        content: "Processing....",
        onContentReady: function() {
          let JCinstance = this;

          vm.$store.dispatch("scheduler/syncBankList").then((res) => {
            const { status, message } = res;

            JCinstance.setContent(
              status == 200
                ? `<div style='color: #24a46d;font-weight: bold;text-align: center;font-size: 25px;'>${message}</div>`
                : `<div style='color: #f5365c;font-weight: bold;text-align: center;font-size: 25px;'>${message}</div>`
            );

            JCinstance.setIcon(
              status == 200
                ? "far fa-check-circle"
                : "fas fa-exclamation-triangle"
            );

            JCinstance.$$close.show();
          });
        },
        buttons: {
          close: {
            text: "Close",
            btnClass: "btn-danger",
            isHidden: true,
          },
        },
      });
    },
  },

  async created() {
    await this.getBankList();

    this.sockets.subscribe("SchedulerSave", async (sockData) => {
      if (sockData.type == "SYNC BANK LIST") {
        let { data } = await this.$store.dispatch("scheduler/getLastSync", {
          type: "SYNC BANK LIST",
        });

        this.lastSync = data ? data.lastSync : "No data found.";
      }
    });

    this.sockets.subscribe("BankListSave", async (sockData) => {
      let { data } = await this.$store.dispatch("banklist/getBankList");

      this.banks = data ? data.PESONetMemberBanks : [];
    });
  },

  mounted() {
    $(".selectpicker").selectpicker();
  },

  destroyed() {
    this.sockets.unsubscribe("SchedulerSave");
    this.sockets.unsubscribe("BankListSave");
    localStorage.removeItem("BankListSearch");
    localStorage.removeItem("BankListPage");
  },
};
</script>

<style scoped>
.cell-danger {
  color: #fa3a0e;
}

.cell-success {
  color: #2dce89;
}

.manual-sync {
  cursor: pointer;
}
</style>
