<template>
  <div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-12" v-if="view == 'description'">
          <p class="description-content">
            Participating institutions may use the Index Endpoint to obtain a
            list of the following:
            <br />
            • Outward Messages sent during a specific clearing cycle
            <br />
            • Inward Batches received during a specific clearing cycle
          </p>

          <form class="send-index">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-control-label">SETTLEMENT DATE</label>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text"
                        ><i class="far fa-calendar-alt"></i
                      ></span>
                    </div>
                    <input
                      type="text"
                      class="form-control"
                      name="settlementDate"
                      v-model="settlementDate"
                      readonly="true"
                    />
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-control-label">CYCLE</label>
                  <input
                    type="text"
                    class="form-control"
                    name="cycle"
                    v-model="cycle"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="col-md-12" v-if="isLoading == 1">
          <div class="row">
            <div class="col-md-12 pt-3 pb-3">
              <app-loader />
            </div>
          </div>
        </div>

        <div
          class="col-md-6"
          v-if="view == 'output' && isLoading == 0 && output.length > 0"
        >
          <h3>RESPONSE PAYLOAD DETAILS</h3>
          <div class="table-responsive">
            <table class="table align-items-center table-dark">
              <thead class="thead-dark">
                <tr>
                  <th scope="col"><b>ELEMENT NAME</b></th>
                  <th scope="col"><b>DESCRIPTION</b></th>
                </tr>
              </thead>
              <tbody class="list">
                <tr v-for="(data, index) in table" :key="index">
                  <td :style="{ textIndent: getTabs(data.tab) }">
                    {{ data.elementName }}
                  </td>
                  <td v-html="data.description"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          class="col-md-6"
          v-if="view == 'output' && isLoading == 0 && output.length > 0"
        >
          <h3>RESPONSE</h3>
          <h4>
            STATUS CODE:
            <span :class="status == 200 ? 'text-success' : 'text-danger'">{{
              status
            }}</span>
          </h4>
          <pre class="p-4 code-section" v-html="output"></pre>
        </div>

        <div
          class="col-md-12"
          v-if="view == 'output' && isLoading == 0 && output.length == 0"
        >
          <div class="row">
            <div class="col-md-12 text-center no-data-found">
              <h1>Failed to connect to Pesonet API.</h1>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer" v-if="isLoading == 0">
      <button
        type="button"
        v-if="view == 'output'"
        class="btn btn-danger"
        @click.prevent="goBack"
      >
        BACK
      </button>
      <button
        type="button"
        v-if="view == 'description'"
        class="btn btn-success"
        @click.prevent="submit"
      >
        SUBMIT
      </button>
    </div>
  </div>
</template>

<script>
import Prism from "prismjs";
import json from "prismjs/components/prism-json";
import Loader from "../../../master/Loader";
import moment from "moment";

export default {
  components: {
    appLoader: Loader,
  },

  props: ["modalStatus"],

  data() {
    return {
      isLoading: 0,
      view: "description",
      settlementDate: "",
      cycle: "",
      output: "",
      status: "",
      table: [
        {
          tab: 0,
          elementName: "Index",
          description: "Root Element",
        },
        {
          tab: 1,
          elementName: "Date/Time",
          description: "Current System Date and Time",
        },
        {
          tab: 1,
          elementName: "Settlement Date",
          description: "Settlement Date of the Index Request",
        },
        {
          tab: 1,
          elementName: "Cycle",
          description: "Cycle of the Index Request",
        },
        {
          tab: 1,
          elementName: "Cycle Status",
          description:
            "OPEN if the cycle is still open <br /> CLOSED if the cycle has closed <br /> FINAL if the cycle has closed and settlement has been completed.",
        },
        {
          tab: 1,
          elementName: "Outward Messages",
          description:
            "Array of Sequence Numbers of Outward Batches sent during the given cycle",
        },
        {
          tab: 1,
          elementName: "Inward Batches",
          description:
            "Array of Sequence Numbers of Inward Batches sent during the given cycle ",
        },
      ],
    };
  },

  watch: {
    modalStatus: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal == 0) this.resetData();
        else if (newVal == 1) this.initDatepicker();
      },
    },
  },

  methods: {
    resetData() {
      this.view = "description";
      this.output = "";
      this.settlementDate = "";
      this.cycle = "";
    },

    initDatepicker() {
      const vm = this;

      this.$nextTick(() => {
        $("input[name='settlementDate']")
          .datepicker({
            autoClose: true,
            language: "en",
            toggleSelected: false,
            dateFormat: "MM d, yyyy",
            onSelect: function(fd, d, picker) {
              vm.settlementDate = fd;
            },
          })
          .data("datepicker");
      });
    },

    goBack() {
      this.resetData();
      this.initDatepicker();
    },

    getTabs(count) {
      return `${+count * 30}px`;
    },

    async submit() {
      const valid = $(".send-index").valid();

      if (!valid) return;

      this.view = "output";
      this.isLoading = 1;

      const payload = {
        settlementDate: moment(this.settlementDate, "MMMM D, YYYY").format(
          "YYYY-MM-DD"
        ),
        cycle: this.cycle,
      };

      const { status, data, responseStatus } = await this.$store.dispatch(
        "api/sendIndex",
        payload
      );

      this.output = data
        ? Prism.highlight(
            JSON.stringify(data, null, 4),
            Prism.languages.json,
            "json"
          )
        : "";
      this.status = responseStatus || "";

      this.isLoading = 0;
    },
  },

  mounted() {
    $(".send-index").validate({
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
  },
};
</script>

<style scoped>
p.description-content {
  font-weight: normal;
  color: #000;
  font-size: 20px;
}

.code-section {
  font-weight: bold;
  background-color: #ddd;
}
</style>
