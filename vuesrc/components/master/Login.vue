<template>
  <div class="main-content login-content">
    <!-- Page content -->
    <div class="container pb-5 login-panel">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card bg-danger border-0 mb-0">
            <div class="card-body px-lg-5 py-lg-5">
              <div class="text-center text-white mb-4 title-panel">
                <b>{{ title }}</b>
              </div>
              <form role="form" @submit.prevent>
                <div class="form-group mb-2">
                  <div
                    class="input-group input-group-merge input-group-alternative"
                  >
                    <div class="input-group-prepend">
                      <span class="input-group-text"
                        ><i class="fas fa-user"></i
                      ></span>
                    </div>
                    <input
                      class="form-control"
                      ref="username"
                      placeholder="USERNAME"
                      type="text"
                      v-model="username"
                      @keydown.enter="login"
                      :readonly="loading"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <div
                    class="input-group input-group-merge input-group-alternative"
                  >
                    <div class="input-group-prepend">
                      <span class="input-group-text"
                        ><i class="fas fa-lock"></i
                      ></span>
                    </div>
                    <input
                      class="form-control"
                      ref="password"
                      placeholder="PASSWORD"
                      type="password"
                      v-model="password"
                      @keydown.enter="login"
                      :readonly="loading"
                    />
                  </div>
                </div>
                <div class="text-center">
                  <button
                    type="button"
                    class="btn btn-success btn-block"
                    @click="login"
                    :disabled="loading"
                  >
                    LOGIN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      step: 0,
      username: "",
      password: "",
      loading: false,
    };
  },

  computed: {
    ...mapGetters({
      baseUrl: "getBaseUrl",
      title: "getAppName",
    }),
  },

  methods: {
    async login() {
      this.loading = true;

      if (!this.username.trim() || !this.password.trim()) {
        this.$popover({
          icon: "fas fa-exclamation-triangle",
          title: "Warning!",
          content: `Please fill up username/password!`,
          buttons: {
            ok: {
              text: "ok",
              btnClass: "btn-success",
              keys: ["enter"],
            },
          },
        });

        this.loading = false;
        return;
      }

      const payload = {
        username: this.username,
        password: this.password,
      };

      const { status, message } = await this.$store.dispatch(
        "auth/login",
        payload
      );

      if (status && status != 200)
        this.$popover({
          icon: "fas fa-exclamation-triangle",
          title: "Warning!",
          content: message,
          buttons: {
            ok: {
              text: "ok",
              btnClass: "btn-success",
              keys: ["enter"],
            },
          },
        });

      this.loading = false;
    },
  },

  mounted() {
    this.$refs.username.focus();
  },

  created() {
    $("body")
      .removeClass()
      .addClass("bg-default")
      .addClass("login-modifier");

    $("body").prop(
      "style",
      `background:url("${this.baseUrl}/img/mufgBG3.jpg") hsla(28, 54%, 20%, 0.74);`
    );

    $(".modal-backdrop").remove();
  },

  destroyed() {
    $("body").removeAttr("style");
  },
};
</script>

<style scoped>
.title-panel {
  font-size: 50px;
}

.login-panel {
  margin-top: 25vh;
}

.main-content {
  overflow: hidden;
}
</style>

<style>
.login-modifier {
  height: 100vh;
  background-repeat: no-repeat !important;
  background-size: 100% 100% !important;
  background-blend-mode: multiply !important;
  background-color: #4d171791 !important;
}

.login-content .inline-button {
  width: 48%;
}

.login-content input[readonly] {
  background-color: #fff;
}
</style>
