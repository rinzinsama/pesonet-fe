<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center mb-3">
        <div class="col">
          <button type="button" class="btn btn-success" @click="sync">
            SYNC
          </button>
        </div>
      </div>
      <div class="row align-items-center">
        <div class="col-md-2">
          <select
            class="selectpicker ignore justify-content-end"
            data-style="btn-danger"
            data-width="100%"
            v-model="filter"
            @change="searchSchedulerLogs()"
          >
            <option value="0">All</option>
            <option value="SYNC BANK LIST">BANK LIST</option>
            <option value="SYNC INWARD">INWARD</option>
            <option value="SYNC OUTWARD">OUTWARD</option>
            <option value="OUTWARD MESSAGE">OUTWARD MESSAGE</option>
            <option value="1">SUCCESS</option>
            <option value="-1">FAILED</option>
          </select>
        </div>
        <div div class="col-md-2 offset-md-8 text-right">
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
              @input="searchSchedulerLogs()"
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
            <th scope="col"><b>TIMESTAMP</b></th>
            <th scope="col"><b>ACTION</b></th>
            <th scope="col"><b>STATUS</b></th>
          </tr>
        </thead>
        <tbody class="list">
          <tr v-for="(log, key) in logs" :key="key">
            <td>{{ log.referenceId }}</td>
            <td>{{ log.createdAt }}</td>
            <td>{{ log.description }}</td>
            <td
              :class="{
                'cell-danger': log.status != 1,
                'cell-success': log.status == 1,
              }"
            >
              {{ getStatusMessage(log.status) }}
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
          :click-handler="getSchedulerLogs"
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
import moment from "moment";

export default {
  components: {
    appLoader: Loader,
    appPagination: Paginate,
  },

  data() {
    return {
      isLoading: 1,
      filter: localStorage.getItem("SchedulerFilter") || 0,
      logs: [],
      search: localStorage.getItem("SchedulerSearch") || "",
      pages: 0,
      page: +localStorage.getItem("SchedulerPage") || 1,
      limit: 8,
    };
  },

  methods: {
    async searchSchedulerLogs() {
      this.page = 1;
      await this.getSchedulerLogs();
    },

    async getSchedulerLogs() {
      this.isLoading = 1;

      localStorage.setItem("SchedulerFilter", this.filter);
      localStorage.setItem("SchedulerSearch", this.search);
      localStorage.setItem("SchedulerPage", this.page);

      let payload = {
        filter: `${this.filter}`,
        page: this.page,
        limit: this.limit,
        search: this.search,
      };

      let { data, lastPage } = await this.$store.dispatch(
        "scheduler/getSchedulerLogs",
        payload
      );

      this.logs = data || [];
      this.pages = lastPage || 0;

      this.isLoading = 0;
    },

    getStatusMessage(status) {
      return status == 1 ? "Success" : "Failed";
    },

    sync() {
      const vm = this;

      const settlementContent = `<div class="container">
                          <form class="modal-form-index">
                                <div class="row">
                                  <div class="col-md-6">
                                    <div class="form-group focused">
                                      <label class="form-control-label">TYPE</label>
                                      <select
                                        class="selectpicker ignore justify-content-end"
                                        data-style="btn-danger"
                                        data-width="100%"
                                        name="index_type"
                                      >
                                        <option value="INWARD">INWARD</option>
                                        <option value="OUTWARD">OUTWARD</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                        <label class="form-control-label">SETTLEMENT DATE</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            name="settlementDate"
                                            readonly="true"
                                        />
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                        <label class="form-control-label">CYCLE</label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            name="cycle"
                                        />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>`;

      this.$popover({
        icon: "far fa-question-circle",
        title: "SYNC",
        content: "",
        columnClass: "col-md-5",
        onOpenBefore: function() {
          this.$$bankList.css("width", "32.3%");
          this.$$index.css("width", "32.3%");
          this.$$cancel.css("width", "32.3%");
          this.$content.css("height", "0");
        },
        buttons: {
          bankList: {
            text: "bank list",
            btnClass: "btn-success",
            action() {
              let JCinstance = this;

              JCinstance.$$bankList.hide();
              JCinstance.$$index.hide();
              JCinstance.$$cancel.hide();

              JCinstance.$content.css("height", "auto");

              JCinstance.setContent("Processing....");
              JCinstance.setIcon("fas fa-circle-notch fa-pulse");

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

              return false;
            },
          },
          index: {
            text: "index",
            btnClass: "btn-success",
            action() {
              let JCinstance = this;

              JCinstance.$$bankList.hide();
              JCinstance.$$index.hide();
              JCinstance.$$cancel.hide();
              JCinstance.$$submit.show();
              JCinstance.$$back.show();
              JCinstance.setColumnClass("col-md-10");

              JCinstance.$content.css("height", "auto");
              JCinstance.setContent(settlementContent);

              JCinstance.$content
                .find("select[name='index_type']")
                .selectpicker();
              JCinstance.$content.find(".modal-form-index").validate({
                rules: {
                  settlementDate: {
                    required: true,
                  },
                  cycle: {
                    required: true,
                    digits: true,
                  },
                },
                errorClass: "jv-error",
                errorPlacement: function(error, element) {
                  element.closest(".form-group").append(error);
                },
                highlight: (element, errorClass) => {
                  $(element).addClass("is-invalid");
                  $(element).removeClass("form-control-alternative");
                },
                unhighlight: (element, errorClass) => {
                  $(element).removeClass("is-invalid");
                  $(element).addClass("form-control-alternative");
                },
              });

              JCinstance.$content
                .find("input[name='settlementDate']")
                .datepicker({
                  autoClose: true,
                  language: "en",
                  toggleSelected: false,
                  dateFormat: "MM d, yyyy",
                });

              return false;
            },
          },
          submit: {
            text: "submit",
            btnClass: "btn-success",
            keys: ["enter"],
            isHidden: true,
            action() {
              let JCinstance = this;

              const valid = JCinstance.$content
                .find(".modal-form-index")
                .valid();
              const settlementDate = JCinstance.$content
                .find("input[name='settlementDate']")
                .val();
              const cycle = JCinstance.$content
                .find("input[name='cycle']")
                .val();
              const type = JCinstance.$content
                .find("select[name='index_type']")
                .val();

              if (valid) {
                JCinstance.$$submit.hide();
                JCinstance.$$back.hide();

                JCinstance.setContent("Processing....");
                JCinstance.setIcon("fas fa-circle-notch fa-pulse");

                const payload = {
                  type,
                  settlementDate: moment(settlementDate, "MMMM D, YYYY").format(
                    "YYYY-MM-DD"
                  ),
                  cycle,
                };

                vm.$store
                  .dispatch("scheduler/syncIndex", payload)
                  .then((res) => {
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
              }

              return false;
            },
          },
          back: {
            text: "back",
            btnClass: "btn-danger",
            isHidden: true,
            action() {
              this.$$bankList.show();
              this.$$index.show();
              this.$$cancel.show();
              this.$$submit.hide();
              this.$$back.hide();
              this.setColumnClass("col-md-5");

              this.setContent("");
              this.$content.css("height", "0");
              $(this.$jconfirmBoxContainer).removeClass("col-md-10");

              return false;
            },
          },
          cancel: {
            text: "Cancel",
            btnClass: "btn-danger",
          },
          close: {
            text: "Close",
            btnClass: "btn-danger",
            isHidden: true,
          },
        },
      });
    },
  },

  mounted() {
    $(".selectpicker").selectpicker("refresh");
  },

  async created() {
    await this.getSchedulerLogs();

    this.sockets.subscribe("SchedulerSave", async () => {
      let payload = {
        filter: `${this.filter}`,
        page: this.page,
        limit: this.limit,
        search: this.search,
      };

      let { data, lastPage } = await this.$store.dispatch(
        "scheduler/getSchedulerLogs",
        payload
      );

      this.logs = data || [];
      this.pages = lastPage || 0;
    });
  },

  destroyed() {
    this.sockets.unsubscribe("SchedulerSave");
    localStorage.removeItem("SchedulerFilter");
    localStorage.removeItem("SchedulerSearch");
    localStorage.removeItem("SchedulerPage");
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
</style>
