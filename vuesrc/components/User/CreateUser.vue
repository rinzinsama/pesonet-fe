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
      <form class="create-user" v-if="isLoading == 0">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">USERNAME</label>
              <input
                type="text"
                class="form-control"
                name="username"
                v-model="username"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">EMAIL</label>
              <input
                type="text"
                class="form-control"
                name="email"
                v-model="email"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">FIRST NAME</label>
              <input
                type="text"
                class="form-control"
                name="firstname"
                v-model="firstName"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">LAST NAME</label>
              <input
                type="text"
                class="form-control"
                name="lastname"
                v-model="lastName"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">MIDDLE NAME</label>
              <input
                type="text"
                class="form-control"
                name="middlename"
                v-model="middleName"
              />
            </div>
          </div>

          <div class="col-lg-6">
            <div class="form-group focused">
              <label class="form-control-label">ROLE</label>
              <select
                class="selectpicker"
                data-style="btn-danger"
                data-width="100%"
                v-model="role"
              >
                <option
                  v-for="(role, key) in roles"
                  :value="role.id"
                  :key="key"
                  >{{ role.role }}</option
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
            @click.prevent="createUser"
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
      role: 0,
      roles: [],
      username: "",
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
    };
  },

  watch: {
    roles: function(newVal) {
      this.$nextTick(() => {
        $(".selectpicker").selectpicker("refresh");
        this.initForm();
      });
    },
  },

  methods: {
    goBack() {
      this.$router.push({ name: "Users" });
    },

    createUser() {
      const valid = $(".create-user").valid();
      const vm = this;

      if (!valid) return;

      let payload = {
        username: this.username,
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        email: this.email,
        roleId: this.role,
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: "CREATE USER",
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

              vm.$store.dispatch("user/createUser", payload).then((res) => {
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
                  vm.firstName = "";
                  vm.lastName = "";
                  vm.middleName = "";
                  vm.username = "";
                  vm.email = "";
                  vm.role = vm.roles[0].id;
                  $(".selectpicker").selectpicker("refresh");
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
      $(".create-user").validate({
        rules: {
          username: {
            required: true,
            minlength: 4,
            maxlength: 16,
            regex: "^(?![\\._])[A-Z0-9]*([\\._]?[A-Z0-9])*$|i",
          },
          email: {
            email: true,
            required: true,
          },
          firstname: {
            required: true,
            maxlength: 50,
            minlength: 1,
          },
          lastname: {
            required: true,
            maxlength: 50,
            minlength: 1,
          },
          middlename: {
            maxlength: 50,
            minlength: 1,
          },
        },
        messages: {
          username: {
            regex:
              "Allowed characters are letters, numbers, (underscore and dot in between characters).",
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

    async getRoles() {
      const { data } = await this.$store.dispatch("role/getRoles");

      this.roles = data || [];
      this.role = data?.[0]?.id;
      this.isLoading = 0;
    },
  },

  async created() {
    await this.getRoles();
  },
};
</script>
