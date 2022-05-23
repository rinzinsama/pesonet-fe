<template>
  <div class="card mb-4">
    <div class="card-body">
      <form class="change-password" @keyup.enter.prevent="changePassword">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">OLD PASSWORD</label>
              <input
                type="password"
                class="form-control"
                name="oldPassword"
                v-model="oldPassword"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">NEW PASSWORD</label>
              <input
                type="password"
                class="form-control"
                name="newPassword"
                v-model="newPassword"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">REPEAT NEW PASSWORD</label>
              <input
                type="password"
                class="form-control"
                name="repeatNewPassword"
                v-model="repeatNewPassword"
              />
            </div>
          </div>
        </div>

        <hr class="my-3" />

        <div class="text-right">
          <button
            type="button"
            class="btn btn-success"
            @click.prevent="changePassword"
          >
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
    };
  },

  methods: {
    changePasswordPopup() {
      this.$popover({
        icon: "fas fa-exclamation-triangle",
        title: "Warning!",
        content:
          "Your current password is still the default password. You must change your password in order to proceed.",
        buttons: {
          ok: {
            text: "ok",
            btnClass: "btn-success",
            keys: ["enter"],
          },
        },
      });
    },

    changePassword() {
      const valid = $(".change-password").valid();
      const vm = this;

      if (!valid) return;

      const payload = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        repeatNewPassword: this.repeatNewPassword,
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: "CHANGE PASSWORD",
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

              vm.$store.dispatch("user/changePassword", payload).then((res) => {
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
                  JCinstance.setContent(
                    `${res.message} <br /> Please relogin.`
                  );
                  JCinstance.$$close.show();
                  vm.$store.dispatch("auth/removeSession");
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

  mounted() {
    if (this.$store.state.session.isPasswordChanged == 0)
      this.changePasswordPopup();

    $(".change-password").validate({
      rules: {
        oldPassword: {
          required: true,
        },
        newPassword: {
          required: true,
          minlength: 4,
          maxlength: 16,
          regex: "^\\S*$|i",
        },
        repeatNewPassword: {
          required: true,
          equalTo: "input[name='newPassword']",
        },
      },
      messages: {
        newPassword: {
          regex:
            "Spaces are not allowed.",
        },
        repeatNewPassword: {
          equalTo: "Repeat new password does not match new password.",
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

  beforeRouteLeave(to, from, next) {
    if (this.$store.state.session.isPasswordChanged == 0)
      this.changePasswordPopup();
    else next();
  },
};
</script>
