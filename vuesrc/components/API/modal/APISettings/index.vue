<template>
  <div
    class="modal fade"
    id="api-settings-modal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="api-settings-modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-100 w-75" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title" id="modal-title-default">
            {{ title }}
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

        <app-view
          v-if="preview == 'view'"
          :preview.sync="preview"
          :title.sync="title"
          :settings="settings"
        />
        <app-update
          v-if="preview == 'update'"
          :preview.sync="preview"
          :title.sync="title"
          :settings="settings"
        />
      </div>
    </div>
  </div>
</template>

<script>
import View from "./View";
import Update from "./Update";

export default {
  components: {
    appView: View,
    appUpdate: Update,
  },

  data() {
    return {
      title: "VIEW SETTINGS",
      preview: "view",
    };
  },

  props: ["viewSettingsModal", "settings"],

  watch: {
    viewSettingsModal(newVal, oldVal) {
      if (newVal == 1) {
        this.title = "VIEW SETTINGS";
        this.preview = "view";

        $("#api-settings-modal").modal({
          backdrop: "static",
        });
      }
    },
  },

  methods: {
    closeModal() {
      $("#api-settings-modal").modal("hide");
      this.$emit("update:viewSettingsModal", 0);
    },
  },
};
</script>
