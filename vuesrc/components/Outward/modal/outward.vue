<template>
  <div
    class="modal fade"
    id="create-outward-modal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="create-outward-modal"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable mw-100"
      :class="outwardModalView || 'hidethis'"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title" id="modal-title-default">
            <b class="modal-title-section">OUTWARD MESSAGE</b>
            <b v-if="outwardData.status == 2" class="modal-title-section text-danger">(PROCESSED)</b>
            <i
              class="far fa-file-pdf pdf-view-button ml-2"
              @click="viewPDF"
              v-if="outwardModalView == 'edit'"
            ></i>
            <i class="fas fa-circle-notch fa-pulse ml-2 text-danger" v-if="outwardData.processing == 1"></i>
            <span class="text-danger" v-if="outwardData.processing == 1">PROCESSING...</span>
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

        <app-edit
          :closeMdl.sync="closeMdl"
          :outwardData="outwardData"
          v-if="outwardModalView == 'edit'"
        />

        <app-upload
          :closeMdl.sync="closeMdl"
          :changeView.sync="changeView"
          v-if="outwardModalView == 'upload'"
        />

        <app-manual
          :closeMdl.sync="closeMdl"
          :changeView.sync="changeView"
          v-if="outwardModalView == 'manual'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Edit from "./edit";
import Upload from "./upload";
import Manual from "./manual_input";
import { mapGetters } from "vuex";

export default {
  components: {
    appEdit: Edit,
    appUpload: Upload,
    appManual: Manual,
  },

  data() {
    return {
      closeMdl: 0,
      changeView: "",
    };
  },

  props: ["viewCreateOutwardModal", "outwardModalView", "outwardData"],

  watch: {
    async viewCreateOutwardModal(newVal, oldVal) {
      this.validatorInit = 0;

      if (newVal == 1) {
        $("#create-outward-modal").modal({
          backdrop: "static",
        });
      }
    },

    closeMdl(newVal) {
      if (newVal == 1) {
        this.closeModal();
        this.closeMdl = 0;
      }
    },

    changeView(newVal) {
      if (newVal != "") this.$emit("update:outwardModalView", newVal);

      this.changeView = "";
    },
  },

  computed: {
    ...mapGetters({
      apiBaseUrl: "getApiBaseUrl",
    }),
  },

  methods: {
    async viewPDF() {
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
            .dispatch("outward/generatePDF", {
              referenceId: vm.outwardData.referenceId,
            })
            .then((res) => {
              const { status, data } = res;

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

    closeModal() {
      $("#create-outward-modal").modal("hide");
      this.$nextTick(() => {
        this.$emit("update:viewCreateOutwardModal", 0);
      });
    },

    parseAmount(amount) {
      const amt = `${amount}`.replace(/,/g, "");

      return (+amt).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    },
  },
};
</script>

<style scoped>
b.modal-title-section {
  font-size: 25px;
}

#create-outward-modal .modal-dialog.manual {
  width: 95%;
}

#create-outward-modal .modal-dialog.edit {
  width: 95%;
}

#create-outward-modal .modal-dialog.upload {
  width: 40%;
}

.hidethis {
  visibility: hidden;
}

.pdf-view-button {
  font-size: 25px;
  color: #f5365c !important;
  cursor: pointer;
}
</style>
