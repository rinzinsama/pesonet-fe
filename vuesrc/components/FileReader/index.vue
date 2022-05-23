<template>
  <div>
    <div class="card mb-4">
      <div class="card-header">
        <div class="row">
          <div class="col-md-6"><b>STATUS</b></div>
          <div class="col-md-6 text-right">
            <button type="button" class="btn btn-success" @click="updatePath">
              UPDATE PATH
            </button>
          </div>
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
          v-if="isLoading == 0"
          class="status-section"
          :class="{ green: status == 1, red: status == 0 }"
        >
          <i
            :class="{
              'fas fa-check-circle': status == 1,
              'fas fa-times-circle': status == 0
            }"
          ></i>
          {{ getStatus }}
        </div>
      </div>
    </div>
    <app-tabs />
  </div>
</template>

<script>
import Tabs from "../FileReader/Tabs";
import Loader from "../master/Loader";

export default {
  components: {
    appTabs: Tabs,
    appLoader: Loader
  },

  data() {
    return {
      isLoading: 0,
      status: 0,
      path: ""
    };
  },

  computed: {
    getStatus() {
      return this.status == 0
        ? "File reader is not running."
        : `File reader is running on ${this.path}`;
    }
  },

  methods: {
    async getData() {
      this.isLoading = 1;

      const { data } = await this.$store.dispatch("reader/checkStatus");

      this.status = +(`${data?.status}` || 0);
      this.path = data?.path || "";

      this.isLoading = 0;
    },

    updatePath() {
      const vm = this;
      const content = `
        <div class="col p-0 popover-error-section">
        </div>
        <div class="col mt-4 p-0">
            Please input new dropsite path. Please use forward slash(/) as folder separator.
        </div>
        <div class="col mt-4 p-0">
            <input
            type="text"
            class="form-control"
            placeholder="PATH NAME"
            name="path"
            />
        </div>
      `;

      this.$popover({
        icon: "far fa-question-circle",
        title: "UPDATE PATH",
        content,
        columnClass: "col-md-6",
        buttons: {
          submit: {
            text: "submit",
            btnClass: "btn-success",
            keys: ["enter"],
            action() {
              let JCinstance = this;
              let pathName = JCinstance.$content
                .find('input[name="path"]')
                .val();

              if (pathName.trim().length == 0) {
                JCinstance.$content
                  .find(".popover-error-section")
                  .append(`<b>Please fill up path field.</b>`);

                return false;
              }

              const path = pathName.trim().replace(/\\/g, "/");

              JCinstance.$$submit.hide();
              JCinstance.$$cancel.hide();

              JCinstance.setContent("Processing....");
              JCinstance.setIcon("fas fa-circle-notch fa-pulse");
              vm.$store.dispatch("reader/updatePath", { path }).then(res => {
                const { status, message, errors, data } = res;

                JCinstance.setIcon(
                  status == 200
                    ? "far fa-check-circle"
                    : "fas fa-exclamation-triangle"
                );

                if (status == 200) {
                  JCinstance.setContent(message);
                  JCinstance.$$close.show();
                  vm.path = data.path;
                } else {
                  JCinstance.setContent(content);
                  JCinstance.$$submit.show();
                  JCinstance.$$cancel.show();
                  JCinstance.$content
                    .find(".popover-error-section")
                    .append(
                      `<b>${message}</b> <br /> ${errors.join("<br />")}`
                    );
                }
              });

              return false;
            }
          },
          cancel: {
            text: "Cancel",
            btnClass: "btn-danger"
          },
          close: {
            text: "Close",
            btnClass: "btn-info",
            isHidden: true
          }
        }
      });
    }
  },

  async created() {
    await this.getData();

    this.sockets.subscribe("FileReaderStatus", async () => {
      const { data } = await this.$store.dispatch("reader/checkStatus");

      this.status = +(`${data?.status}` || 0);
      this.path = data?.path || "";
    });
  },

  destroyed() {
    this.sockets.unsubscribe("FileReaderStatus");
  }
};
</script>

<style scoped>
.status-section.green {
  color: #24a46d;
}

.status-section.red {
  color: #fa3a0e;
}

.status-section {
  font-size: 30px;
}
</style>
