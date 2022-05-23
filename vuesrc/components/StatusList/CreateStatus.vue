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
      <form class="create-status" v-if="isLoading == 0">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">STATUS CODE</label>
              <input
                type="text"
                class="form-control"
                name="statusCode"
                v-model="statusCode"
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
                v-model="statusName"
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
                v-model="description"
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
                v-model="type"
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
        </div>

        <hr class="my-3" />

        <div class="text-right">
          <button
            type="button"
            class="btn btn-success"
            @click.prevent="createStatus"
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
      type: 0,
      types: [],
      statusCode: "",
      statusName: "",
      description: "",
    };
  },

  watch: {
    types: function(newVal) {
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

    createStatus() {
      const valid = $(".create-status").valid();
      const vm = this;

      if (!valid) return;

      let payload = {
        statusCode: this.statusCode,
        statusName: this.statusName,
        description: this.description,
        type: this.type,
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: "CREATE STATUS",
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
                .dispatch("statuslist/createStatus", payload)
                .then((res) => {
                  const { status, message, errors } = res;

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
                    vm.statusCode = "";
                    vm.statusName = "";
                    vm.description = "";
                    vm.role = vm.types[0].id;
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

    initForm() {
      $(".create-status").validate({
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

    async getTypes() {
      const { data } = await this.$store.dispatch("statustype/getTypes");

      this.types = data || [];
      this.type = data?.[0]?.id;
      this.isLoading = 0;
    },
  },

  async created() {
    await this.getTypes();
  },
};
</script>

<style scoped>
textarea {
  height: auto !important;
}
</style>
