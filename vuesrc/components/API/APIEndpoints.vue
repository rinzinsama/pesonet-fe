<template>
  <div class="card mb-4">
    <div class="card-header">
      <div class="row">
        <div class="col-md-6"><b>API ENDPOINTS</b></div>
      </div>
    </div>
    <div class="card-body">
      <div class="row mb-4">
        <div
          class="col-lg-4"
          v-for="(link, index) in links"
          :key="index"
          @click="openModal(index)"
        >
          <div class="card card-stats bg-gradient-danger pointer">
            <div class="card-body">
              <div class="row">
                <div class="col label-col">
                  <h3
                    class="card-title text-uppercase text-muted mb-0 text-white"
                  >
                    {{ link.title }}
                  </h3>
                  <div class="spacer"></div>
                  <span class="h2 font-weight-bold mb-0 text-white">{{
                    link.method
                  }}</span>
                  <span
                    class="block-section font-weight-bold mb-0 text-white"
                    >{{ link.path }}</span
                  >
                </div>
                <div class="col-auto">
                  <div
                    class="icon icon-shape rounded-circle shadow bg-white text-danger"
                  >
                    <i :class="link.icon"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <app-view-endpoints-modal
        :viewEndpointsModal.sync="viewEndpointsModal"
        :title="getTitle"
        :method="getMethod"
        :path="getPath"
        :selected="selected"
      />
    </div>
  </div>
</template>

<script>
import ViewEndpointsModal from "./modal/APIEndpoints/index";

export default {
  components: {
    appViewEndpointsModal: ViewEndpointsModal,
  },

  data() {
    return {
      selected: null,
      viewEndpointsModal: 0,
      links: [
        {
          title: "Heartbeat",
          method: "GET",
          path: "/api/v2/heartbeat",
          icon: "fas fa-heartbeat",
        },
        {
          title: "Index",
          method: "GET",
          path: "/api/v2/index/<year>/<month>/<date>/<cycle>",
          icon: "fas fa-list-ol",
        },
        {
          title: "Outward Message",
          method: "POST",
          path: "/api/v2/outward_message/create",
          icon: "fas fa-mail-bulk",
        },
        {
          title: "Inward Batch",
          method: "POST",
          path: "/api/v2/inward_batch/<inward_batch_seq>",
          icon: "fas fa-envelope-open-text",
        },
        {
          title: "Inward Batch Status Update",
          method: "POST",
          path: "/api/v2/inward_batch/update",
          icon: "fas fa-reply",
        },
        {
          title: "Outward Message Status Update",
          method: "GET",
          path: "/api/v2/outward_message/<outward_msg_seq>",
          icon: "fas fa-reply-all",
        },
        {
          title: "Outward Message Search",
          method: "POST",
          path: "/api/v2/outward_message/search",
          icon: "fas fa-at",
        },
        {
          title: "Bank List",
          method: "GET",
          path: "/api/v2/banks",
          icon: "fas fa-hotel",
        },
      ],
    };
  },

  computed: {
    getTitle() {
      return this.selected != null ? this.links[this.selected].title : "";
    },

    getMethod() {
      return this.selected != null ? this.links[this.selected].method : "";
    },

    getPath() {
      return this.selected != null ? this.links[this.selected].path : "";
    },
  },

  methods: {
    openModal(index) {
      this.selected = index;
      this.viewEndpointsModal = 1;
    },
  },
};
</script>

<style scoped>
.block-section {
  display: block;
}

.pointer {
  cursor: pointer;
}

.label-col {
  overflow: hidden;
}
</style>
