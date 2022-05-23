<template>
  <div
    class="modal fade"
    id="inward-generate-files-modal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="inward-generate-files-modal"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable mw-100"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title" id="modal-title-default">
            <b class="modal-title-section mr-2">GENERATE TGS/HOTSCAN</b>
          </h6>
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click.prevent="closeModal"
          >
            <span aria-hidden="true" class="close-icon">×</span>
          </button>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col-md-4">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  name="file_settlement_date"
                  placeholder="SETTLEMENT DATE"
                  :value="date"
                  readonly
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-danger"
                    type="button"
                    @click.prevent="generateFiles"
                  >
                    GENERATE
                  </button>
                </div>
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

        <div
          v-if="
            files.length == 0 && isLoading == 0 && generateHasTriggered == 1
          "
        >
          <div class="row">
            <div class="col-md-12 text-center no-data-found">
              <h1>No data found.</h1>
            </div>
          </div>
        </div>

        <div class="table-responsive" v-if="isLoading == 0 && files.length > 0">
          <table class="table align-items-center table-flush">
            <thead class="thead-light">
              <tr>
                <th scope="col"><b>SEQUENCE NUMBER</b></th>
                <th scope="col"><b>TRANSACTION ID</b></th>
                <th scope="col"></th>
              </tr>
            </thead>
          </table>
        </div>

        <div
          class="table-responsive table-body-content"
          v-if="isLoading == 0 && files.length > 0"
        >
          <table class="table align-items-center table-flush">
            <tbody class="list">
              <tr v-for="(file, key) in files" :key="key">
                <td>{{ file.sequenceNumber }}</td>
                <td>{{ file.range }}</td>
                <td>
                  <div
                    class="custom-control custom-control-alternative custom-checkbox mr-1 same-line"
                  >
                    <input
                      class="custom-control-input file-checkbox"
                      :id="`file-checkbox-${file.sequenceNumber}`"
                      type="checkbox"
                    />
                    <label
                      class="custom-control-label"
                      :for="`file-checkbox-${file.sequenceNumber}`"
                      @click.stop.prevent="toggleCheckbox(file.sequenceNumber)"
                    ></label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-footer" v-if="isLoading == 0 && files.length > 0">
          <button
            type="button"
            class="btn btn-success px-3"
            @click.prevent="checkAll()"
            v-if="!isFull"
          >
            <i class="fas fa-check-double"></i>
          </button>

          <button
            type="button"
            class="btn btn-warning px-3"
            @click.prevent="removeAll()"
            v-if="isFull"
          >
            <i class="far fa-times-circle"></i>
          </button>

          <button
            type="button"
            class="btn btn-danger"
            :disabled="checkFileRack.length == 0"
            @click.prevent="generateFilePDF()"
          >
            GENERATE PDF
            <span class="badge badge-primary">{{ checkFileRack.length }}</span>
          </button>

          <button
            type="button"
            class="btn btn-danger"
            :disabled="checkFileRack.length == 0"
            @click.prevent="downloadGroupFile('tgs')"
          >
            DOWNLOAD TGS
            <span class="badge badge-primary">{{ checkFileRack.length }}</span>
          </button>

          <button
            type="button"
            class="btn btn-danger"
            :disabled="checkFileRack.length == 0"
            @click.prevent="downloadGroupFile('hotscan')"
          >
            DOWNLOAD HOTSCAN
            <span class="badge badge-primary">{{ checkFileRack.length }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "../../master/Loader";
import moment from "moment";
import { saveAs } from "file-saver";
import { mapGetters } from "vuex";

export default {
  components: {
    appLoader: Loader,
  },

  data() {
    return {
      generateHasTriggered: 0,
      date: "",
      files: [],
      isLoading: 0,
      checkFileRack: [],
    };
  },

  props: ["viewGenerateFilesModal"],

  computed: {
    isFull() {
      return this.checkFileRack.length == this.files.length;
    },

    ...mapGetters({
      apiBaseUrl: "getApiBaseUrl",
    }),
  },

  watch: {
    async viewGenerateFilesModal(newVal, oldVal) {
      if (newVal == 1) {
        this.files = [];
        this.checkFileRack = [];
        this.generateHasTriggered = 0;
        this.date = "";
        this.isLoading = 0;

        $("#inward-generate-files-modal").modal({
          backdrop: "static",
        });
      }
    },
  },

  methods: {
    closeModal() {
      $("#inward-generate-files-modal").modal("hide");
      this.$emit("update:viewGenerateFilesModal", 0);
    },

    async generateFiles() {
      if (this.date.trim().length == 0) {
        this.$popover({
          icon: "fas fa-exclamation-triangle",
          title: "Warning!",
          content: `Please select a settlement date!`,
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

      this.isLoading = 1;
      let payload = {
        date: this.date
          ? moment(this.date, "MMMM D, YYYY").format("YYYY-MM-DD")
          : "",
      };

      const { status, data } = await this.$store.dispatch(
        "inward/getTransactionForFileGeneration",
        payload
      );

      this.files = data ? data : [];
      this.generateHasTriggered = 1;
      this.isLoading = 0;
    },

    toggleCheckbox(idx) {
      $(`#file-checkbox-${idx}`).prop(
        "checked",
        !$(`#file-checkbox-${idx}`).is(":checked")
      );

      if (this.checkFileRack.includes(+idx))
        this.checkFileRack = this.checkFileRack.filter((chk) => chk != +idx);
      else this.checkFileRack.push(+idx);
    },

    async downloadGroupFile(type) {
      let data = await this.$store.dispatch("inward/downloadGroupFile", {
        file: this.checkFileRack,
        type,
      });

      let filename = "";
      const dateFilename = moment(this.date, "MMMM DD, YYYY").format(
        "YYYYMMDD"
      );

      if (type == "hotscan") filename = `HotScanPesonet`;
      else if (type == "tgs") filename = `TGSPesonet`;

      if (data instanceof Blob) saveAs(data, `${filename}-${dateFilename}.tsv`);
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

    async generateFilePDF() {
      const vm = this;

      this.$popover({
        icon: "fas fa-circle-notch fa-pulse",
        title: "GENERATING LINK...",
        content: "",
        onOpenBefore: function() {
          $(this.$contentPane).remove();
        },
        onContentReady: function() {
          vm.$store
            .dispatch("inward/generateFilePDF", {
              file: vm.checkFileRack,
            })
            .then((res) => {
              const { status, data } = res;
              console.log(`${vm.apiBaseUrl}/PDF/viewPDF/${data.link}`);
              window.open(
                `${vm.apiBaseUrl}/PDF/viewPDF/${data.link}`,
                "_blank"
              );
              this.close();
            });
        },
        buttons: {
          ok: {
            isHidden: true,
          },
        },
      });
    },

    checkAll() {
      $(".file-checkbox").prop("checked", true);
      this.checkFileRack = this.files.map((file) => +file.sequenceNumber);
    },

    removeAll() {
      $(".file-checkbox").prop("checked", false);
      this.checkFileRack = [];
    },
  },

  mounted() {
    const vm = this;

    $("input[name='file_settlement_date']").datepicker({
      autoClose: true,
      language: "en",
      toggleSelected: false,
      dateFormat: "MM d, yyyy",
      onSelect: async function(fd, d, picker) {
        vm.date = fd;
      },
    });
  },
};
</script>

<style scoped>
#inward-generate-files-modal .modal-dialog {
  width: 95%;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
}

#inward-generate-files-modal td:nth-child(1),
#inward-generate-files-modal th:nth-child(1) {
  width: 30%;
}

#inward-generate-files-modal td:nth-child(2),
#inward-generate-files-modal th:nth-child(2) {
  width: 50%;
}

.custom-control-alternative .custom-control-label::before {
  border: 1px solid black;
}

.custom-control-label::before {
  margin-top: -5px;
  width: 1.5rem;
  height: 1.5rem;
}

.custom-control-label::after {
  margin-top: -5px;
  width: 1.5rem;
  height: 1.5rem;
}

.table-responsive.table-body-content {
  max-height: 60vh;
}

button i {
  font-size: 20px;
}
</style>
