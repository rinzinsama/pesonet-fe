<template>
  <div
    class="modal fade"
    id="api-endpoints-modal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="api-endpoints-modal"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable mw-100 w-75"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title" id="modal-title-default">
            <b class="modal-title-section mr-2">{{ getTitle }}</b>
            <span class="modal-label-section text-success"
              ><b>{{ method }}</b></span
            >
            <span class="modal-label-section">{{ path }}</span>
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

        <app-heartbeat :modalStatus="viewEndpointsModal" v-if="selected == 0" />
        <app-index :modalStatus="viewEndpointsModal" v-if="selected == 1" />
        <app-outward-message
          :modalStatus="viewEndpointsModal"
          v-if="selected == 2"
        />
        <app-inward :modalStatus="viewEndpointsModal" v-if="selected == 3" />
        <app-inward-update
          :modalStatus="viewEndpointsModal"
          v-if="selected == 4"
        />
        <app-outward-message-status-update
          :modalStatus="viewEndpointsModal"
          v-if="selected == 5"
        />
        <app-outward-message-search
          :modalStatus="viewEndpointsModal"
          v-if="selected == 6"
        />
        <app-bank-list :modalStatus="viewEndpointsModal" v-if="selected == 7" />
      </div>
    </div>
  </div>
</template>

<script>
import Heartbeat from "./Heartbeat";
import BankList from "./BankList";
import Index from "./IndexEndpoint";
import Inward from "./Inward";
import InwardUpdate from "./InwardUpdate";
import OutwardMessage from "./OutwardMessage";
import OutwardMessageStatusUpdate from "./OutwardMessageStatusUpdate";
import OutwardMessageSearch from "./OutwardMessageSearch";

export default {
  components: {
    appHeartbeat: Heartbeat,
    appBankList: BankList,
    appIndex: Index,
    appInward: Inward,
    appInwardUpdate: InwardUpdate,
    appOutwardMessage: OutwardMessage,
    appOutwardMessageStatusUpdate: OutwardMessageStatusUpdate,
    appOutwardMessageSearch: OutwardMessageSearch,
  },

  props: ["viewEndpointsModal", "title", "method", "path", "selected"],

  computed: {
    getTitle() {
      return `${this.title} Endpoint`.toUpperCase();
    },
  },

  watch: {
    viewEndpointsModal(newVal, oldVal) {
      if (newVal == 1) {
        $("#api-endpoints-modal").modal({
          backdrop: "static",
        });
      }
    },
  },

  methods: {
    closeModal() {
      $("#api-endpoints-modal").modal("hide");
      this.$emit("update:viewEndpointsModal", 0);
    },
  },
};
</script>

<style scoped>
b.modal-title-section {
  font-size: 25px;
}
</style>
