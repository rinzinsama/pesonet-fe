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
        class="update-user"
        v-if="isLoading == 0 && Object.keys(user).length > 0"
      >
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">REFERENCE ID</label>
              <input
                type="text"
                class="form-control"
                name="referenceId"
                v-model="user.referenceId"
                readonly="true"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">USERNAME</label>
              <input
                type="text"
                class="form-control"
                name="username"
                v-model="user.username"
                readonly="true"
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
                v-model="user.email"
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
                v-model="user.firstName"
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
                v-model="user.lastName"
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
                v-model="user.middleName"
              />
            </div>
          </div>

          <div class="col-md-6" v-if="user.status != 1">
            <div class="form-group">
              <label class="form-control-label">ROLE</label>
              <input
                type="text"
                class="form-control"
                name="middlename"
                readonly="true"
                v-model="user.role"
              />
            </div>
          </div>

          <div class="col-lg-6" v-if="user.status == 1">
            <div class="form-group focused">
              <label class="form-control-label">ROLE</label>
              <select
                class="selectpicker"
                data-style="btn-danger"
                data-width="100%"
                v-model="user.roleId"
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

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">STATUS</label>
              <input
                type="text"
                class="form-control"
                name="middlename"
                readonly="true"
                :value="getStatus(user.status)"
              />
            </div>
          </div>
        </div>

        <hr class="my-3" v-if="[0, 1].includes(+user.status)" />

        <div class="text-right">
          <button
            type="button"
            class="btn btn-danger"
            v-if="user.status == 1"
            @click.prevent="deleteUser"
          >
            DELETE
          </button>

          <button
            type="button"
            class="btn btn-success"
            v-if="user.status == 1"
            @click.prevent="updateUser"
          >
            SUBMIT
          </button>

          <button
            type="button"
            class="btn btn-success"
            v-if="user.status == 0"
            @click.prevent="unlockUser"
          >
            UNLOCK
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
      roles: [],
      user: {},
    };
  },

  watch: {
    user: function(newVal) {
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

    getStatus(status) {
      let stat = "";

      if (status == 1) stat = "ACTIVE";
      else if (status == 0) stat = "LOCKED";
      else stat = "BANNED";

      return stat;
    },

    initForm() {
      $(".update-user").validate({
        rules: {
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
        { status: roleStatus, data: roleData },
        { status: userStatus, data: userData },
      ] = await Promise.all([
        await this.$store.dispatch("role/getRoles"),
        await this.$store.dispatch("user/getUser", payload),
      ]);

      if (userStatus >= 400) {
        return this.$router.push({ name: "Page Not Found" });
      }

      this.roles = roleData || [];
      this.user = userData || {};

      this.isLoading = 0;
    },

    unlockUser() {
      const vm = this;
      let payload = {
        referenceId: this.user.referenceId,
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: "UNLOCK USER",
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

              vm.$store.dispatch("user/unlockUser", payload).then((res) => {
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

    deleteUser() {
      const vm = this;
      let payload = {
        referenceId: this.user.referenceId,
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: "DELETE USER",
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

              vm.$store.dispatch("user/deleteUser", payload).then((res) => {
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
                  vm.goBack();
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

    updateUser() {
      const valid = $(".update-user").valid();
      const vm = this;

      if (!valid) return;

      let payload = {
        referenceId: this.user.referenceId,
        firstName: this.user.firstName,
        middleName: this.user.middleName,
        lastName: this.user.lastName,
        email: this.user.email,
        roleId: this.user.roleId,
        status: this.user.status,
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: "UPDATE USER",
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

              vm.$store.dispatch("user/updateUser", payload).then((res) => {
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

    this.sockets.subscribe("UserManagementSave", ({ data }) => {
      if (this.user?.referenceId == data.referenceId) this.user = data || {};
    });
  },

  destroyed() {
    this.sockets.unsubscribe("UserManagementSave");
  },
};
</script>
