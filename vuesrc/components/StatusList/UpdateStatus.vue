<template>
  <div class="card mb-4">
    <div class="card-header">
      <button type="button" class="btn btn-warning" @click="goBack">
        BACK
      </button>
    </div>
    <div class="card-body">
      <div v-if="isLoading == 1">
        <div class="row">
          <div class="col-md-12 pt-3 pb-3">
            <app-loader />
          </div>
        </div>
      </div>
      <form
        class="update-status"
        v-if="isLoading == 0 && Object.keys(status).length > 0"
      >
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">REFERENCE ID</label>
              <input
                type="text"
                class="form-control"
                name="referenceId"
                v-model="status.referenceId"
                readonly="true"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">STATUS CODE</label>
              <input
                type="text"
                class="form-control"
                name="statusCode"
                v-model="status.statusCode"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">STATUS NAME</label>
              <input
                type="text"
                class="form-control"
                name="statusName"
                v-model="status.statusName"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label class="form-control-label">DESCRIPTION</label>
              <textarea
                class="form-control"
                rows="6"
                name="description"
                v-model="status.description"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-6">
            <div class="form-group focused">
              <label class="form-control-label">TYPE</label>
              <select
                class="selectpicker"
                data-style="btn-danger"
                data-width="100%"
                v-model="status.type"
              >
                <option
                  v-for="(type, key) in types"
                  :value="type.id"
                  :key="key"
                  >{{ type.type }}</option
                >
              </select>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="form-group focused">
              <label class="form-control-label">STATUS</label>
              <select
                class="selectpicker"
                data-style="btn-danger"
                data-width="100%"
                v-model="status.status"
              >
                <option value="0">INACTIVE</option>
                <option value="1">ACTIVE</option>
              </select>
            </div>
          </div>
        </div>

        <hr class="my-3" />
        <div class="text-right">
          <button
            type="button"
            class="btn btn-success"
            @click.prevent="updateStatus"
          >
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Loader from "../master/Loader";

export default {
  components: {
    appLoader: Loader,
  },

  data() {
    return {
      isLoading: 1,
      types: [],
      status: {},
    };
  },

  watch: {
    status: function(newVal) {
      this.$nextTick(() => {
        $(".selectpicker").selectpicker("refresh");
        this.initForm();
      });
    },
  },

  methods: {
    goBack() {
      this.$router.push({ name: "Status Lists" });
    },

    initForm() {
      $(".update-status").validate({
        rules: {
          statusCode: {
            required: true,
          },
          statusName: {
            required: true,
          },
          description: {
            required: true,
          },
        },
        errorClass: "jv-error",
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

    async getData() {
      let payload = {
        referenceId: this.$route.params.id,
      };

      const [
        { status: typeStatus, data: typeData },
        { status: statusStatus, data: statusData },
      ] = await Promise.all([
        await this.$store.dispatch("statustype/getTypes"),
        await this.$store.dispatch("statuslist/getList", payload),
      ]);

      if (statusStatus >= 400) {
        return this.$router.push({ name: "Page Not Found" });
      }

      this.types = typeData || [];
      this.status = statusData || {};

      this.isLoading = 0;
    },

    updateStatus() {
      const valid = $(".update-status").valid();
      const vm = this;

      if (!valid) return;

      let payload = {
        referenceId: this.status.referenceId,
        statusCode: this.status.statusCode,
        statusName: this.status.statusName,
        description: this.status.description,
        type: this.status.type,
        status: this.status.status,
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: "UPDATE STATUS",
        content: "",
        buttons: {
          submit: {
            text: "submit",
            btnClass: "btn-success",
            keys: ["enter"],
            action() {
              let JCinstance = this;

              JCinstance.$$submit.hide();
              JCinstance.$$cancel.hide();

              JCinstance.setContent("Processing....");
              JCinstance.setIcon("fas fa-circle-notch fa-pulse");

              vm.$store
                .dispatch("statuslist/updateStatus", payload)
                .then((res) => {
                  const { status, message, errors, data } = res;

                  JCinstance.setIcon(
                    status == 200
                      ? "far fa-check-circle"
                      : "fas fa-exclamation-triangle"
                  );

                  JCinstance.setContent(
                    status == 200
                      ? message
                      : `<b>${message}</b> <br /> ${errors.join("<br />")}`
                  );

                  if (status == 200) {
                    JCinstance.$$close.show();
                    vm.user = data;
                  } else {
                    JCinstance.$$submit.show();
                    JCinstance.$$cancel.show();
                  }
                });

              return false;
            },
          },
          cancel: {
            text: "Cancel",
            btnClass: "btn-danger",
          },
          close: {
            text: "Close",
            btnClass: "btn-info",
            isHidden: true,
          },
        },
      });
    },
  },

  async created() {
    await this.getData();

    this.sockets.subscribe("StatusListSave", ({ data }) => {
      if (this.status?.referenceId == data.referenceId)
        this.status = data || {};
    });
  },

  destroyed() {
    this.sockets.unsubscribe("StatusListSave");
  },
};
</script>
