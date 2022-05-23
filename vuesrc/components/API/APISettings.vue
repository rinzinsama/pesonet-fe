<template>
  <div class="card mb-4">
    <div class="card-header">
      <div class="row">
        <div class="col-md-6"><b>API SETTINGS</b></div>
      </div>
    </div>
    <div class="card-body">
      <div v-if="isLoading == 1">
        <div class="row">
          <div class="col-md-12 pt-3 pb-3">
            <app-loader />
          </div>
        </div>
      </div>

      <div
        v-if="isLoading == 0 && Object.keys(settings).length > 0"
        class="url-section"
      >
        <b>API URL</b>
        <i class="fas fa-globe"></i>
        {{ settings.url }}

        <hr class="my-3" />

        <div class="text-right">
          <button
            type="button"
            class="btn btn-success"
            @click.prevent="checkConnection"
          >
            CHECK CONNECTION
          </button>

          <button
            type="button"
            class="btn btn-danger"
            @click.prevent="viewSettings"
          >
            VIEW SETTINGS
          </button>
        </div>
      </div>

      <app-view-settings-modal
        :viewSettingsModal.sync="viewSettingsModal"
        :settings="settings"
      />
    </div>
  </div>
</template>

<script>
import Loader from "../master/Loader";
import ViewSettingsModal from "./modal/APISettings/index";

export default {
  components: {
    appLoader: Loader,
    appViewSettingsModal: ViewSettingsModal,
  },

  data() {
    return {
      isLoading: 1,
      settings: {},
      viewSettingsModal: 0,
    };
  },

  methods: {
    async getSettings() {
      this.isLoading = 1;

      const { data } = await this.$store.dispatch("api/getApiSettings");

      this.settings = data || {};

      this.isLoading = 0;
    },

    viewSettings() {
      this.viewSettingsModal = 1;
    },

    checkConnection() {
      const vm = this;

      this.$popover({
        icon: "fas fa-circle-notch fa-pulse",
        title: "CHECK CONNECTION",
        content: "Processing....",
        onContentReady: function() {
          let JCinstance = this;

          vm.$store.dispatch("api/sendHeartbeat").then((res) => {
            const { status } = res;

            JCinstance.setContent(
              status == 200
                ? "<div style='color: #24a46d;font-weight: bold;text-align: center;font-size: 25px;'>Connected</div>"
                : "<div style='color: #f5365c;font-weight: bold;text-align: center;font-size: 25px;'>Failed to connect.</div>"
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
    this.sockets.subscribe("APIUpdate", async () => {
      const { data } = await this.$store.dispatch("api/getApiSettings");

      this.settings = data || {};
    });

    await this.getSettings();
  },

  destroyed() {
    this.sockets.unsubscribe("APIUpdate");
  },
};
</script>

<style scoped>
.url-section {
  font-size: 30px;
  color: #24a46d;
}
</style>
