<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-md-2">
          <div class="form-group focused mb-0">
            <label class="form-control-label">FROM DATE</label>
            <div class="input-group input-group-alternative input-group-merge">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i class="far fa-calendar-alt"></i
                ></span>
              </div>
              <input
                class="form-control"
                type="text"
                name="from"
                :value="from"
                readonly="true"
              />
            </div>
          </div>
        </div>

        <div class="col-md-2">
          <div class="form-group focused mb-0">
            <label class="form-control-label">TO DATE</label>
            <div class="input-group input-group-alternative input-group-merge">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i class="far fa-calendar-alt"></i
                ></span>
              </div>
              <input
                class="form-control"
                type="text"
                name="to"
                :value="to"
                readonly="true"
              />
            </div>
          </div>
        </div>

        <div div class="col-md-2 offset-md-6 text-right">
          <div class="form-group focused mb-0">
            <label class="form-control-label">&nbsp;</label>
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
                @input="searchData()"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col text-right">
          <button
            type="button"
            class="btn btn-danger mt-3"
            @click.prevent="searchData"
          >
            SEARCH
          </button>
        </div>
      </div>
    </div>
    <div v-if="searched">
      <div v-if="isLoading == 1">
        <div class="row">
          <div class="col-md-12 pt-3 pb-3">
            <app-loader />
          </div>
        </div>
      </div>
      <div v-if="auditTrails.length == 0 && isLoading == 0">
        <div class="row">
          <div class="col-md-12 text-center no-data-found">
            <h1>No data found.</h1>
          </div>
        </div>
      </div>
      <div
        class="table-responsive"
        v-if="isLoading == 0 && auditTrails.length > 0"
      >
        <table class="table align-items-center table-flush">
          <thead class="thead-light">
            <tr>
              <th scope="col"><b>REFERENCE NUMBER</b></th>
              <th scope="col"><b>USERNAME</b></th>
              <th scope="col"><b>IP</b></th>
              <th scope="col"><b>URL</b></th>
              <th scope="col"><b>MODULE</b></th>
              <th scope="col"><b>METHOD</b></th>
              <th scope="col"><b>LOG</b></th>
              <th scope="col"><b>TIMESTAMP</b></th>
            </tr>
          </thead>
          <tbody class="list">
            <tr v-for="(trail, key) in auditTrails" :key="key">
              <td>{{ trail.referenceId }}</td>
              <td>{{ trail.username }}</td>
              <td>{{ trail.ip }}</td>
              <td>{{ trail.url }}</td>
              <td>{{ trail.module }}</td>
              <td>{{ trail.method }}</td>
              <td>{{ trail.log }}</td>
              <td>{{ trail.createdAt }}</td>
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
            :click-handler="getData"
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
  </div>
</template>

<script>
import moment from "moment";
import Loader from "../master/Loader";
import Paginate from "vuejs-paginate";

export default {
  components: {
    appLoader: Loader,
    appPagination: Paginate,
  },

  data() {
    return {
      searched: 0,
      isLoading: 0,
      search: localStorage.getItem("AuditTrailSearch") || "",
      from: "",
      to: "",
      pages: 0,
      page: +localStorage.getItem("AuditTrailPage") || 1,
      limit: 8,
      auditTrails: [],
    };
  },

  watch: {
    from: function() {
      if (this.from.length != 0) this.initializeToDate();

      this.checkDate();
    },
    to: async function() {
      this.checkDate();
    },
  },

  methods: {
    async searchData() {
      if (!this.from || !this.to) {
        this.$popover({
          icon: "fas fa-exclamation-triangle",
          title: "Warning!",
          content: `Please fill up from/to date field!`,
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

      this.page = 1;
      await this.getData();
    },

    async getData() {
      this.searched = 1;
      this.isLoading = 1;

      localStorage.setItem("AuditTrailSearch", this.search);
      localStorage.setItem("AuditTrailPage", this.page);

      let payload = {
        from: moment(this.from, "MMMM D, YYYY").format("YYYY-MM-DD"),
        to: moment(this.to, "MMMM D, YYYY").format("YYYY-MM-DD"),
        page: this.page,
        limit: this.limit,
        search: this.search,
      };

      let { data, lastPage } = await this.$store.dispatch(
        "audit/getAuditTrail",
        payload
      );

      this.auditTrails = data || [];
      this.pages = lastPage || 0;

      this.isLoading = 0;
    },

    initializeToDate() {
      const vm = this;
      const fromDate = $('input[name="from"]').data("datepicker");

      let datepickerTo = $("input[name='to']")
        .datepicker({
          autoClose: true,
          language: "en",
          toggleSelected: false,
          dateFormat: "MM d, yyyy",
          minDate: fromDate.selectedDates[0],
          onSelect: function(fd, d, picker) {
            localStorage.setItem("AuditTrailToDate", fd);
            vm.to = fd;
          },
        })
        .data("datepicker");

      if (localStorage.getItem("AuditTrailToDate") && this.searched == 0) {
        const toDate = moment(
          localStorage.getItem("AuditTrailToDate"),
          "MMMM D, YYYY"
        ).toDate();

        datepickerTo.selectDate(toDate);
      }
    },

    checkDate() {
      let fromDate = $('input[name="from"]').data("datepicker");
      let toDate = $('input[name="to"]').data("datepicker");

      if (fromDate.selectedDates.length > 0 && toDate.selectedDates.length > 0)
        if (fromDate.selectedDates[0] > toDate.selectedDates[0]) toDate.clear();
    },
  },

  mounted() {
    const vm = this;

    let datepicker = $("input[name='from']")
      .datepicker({
        autoClose: true,
        language: "en",
        toggleSelected: false,
        dateFormat: "MM d, yyyy",
        onSelect: function(fd, d, picker) {
          localStorage.setItem("AuditTrailFromDate", fd);
          vm.from = fd;
        },
      })
      .data("datepicker");

    if (localStorage.getItem("AuditTrailFromDate")) {
      const fromDate = moment(
        localStorage.getItem("AuditTrailFromDate"),
        "MMMM D, YYYY"
      ).toDate();

      datepicker.selectDate(fromDate);
    }
  },

  created() {
    this.sockets.subscribe("AuditTrailSave", async () => {
      let payload = {
        from: moment(this.from, "MMMM D, YYYY").format("YYYY-MM-DD"),
        to: moment(this.to, "MMMM D, YYYY").format("YYYY-MM-DD"),
        page: this.page,
        limit: this.limit,
        search: this.search,
      };

      let { data, lastPage } = await this.$store.dispatch(
        "audit/getAuditTrail",
        payload
      );

      this.auditTrails = data || [];
      this.pages = lastPage || 0;
    });
  },

  destroyed() {
    this.sockets.unsubscribe("AuditTrailSave");
    localStorage.removeItem("AuditTrailFromDate");
    localStorage.removeItem("AuditTrailToDate");
    localStorage.removeItem("AuditTrailSearch");
    localStorage.removeItem("AuditTrailPage");
  },
};
</script>
