<template>
  <div>
    <app-not-found v-if="isNotFound" />
    <div v-if="!isNotFound">
      <app-full-loader v-if="fullLoader" />
      <app-login v-if="!isLogged && !fullLoader" />
      <app-template v-if="isLogged && !fullLoader" />
    </div>
  </div>
</template>

<script>
import Template from "./master/Template";
import NotFound from "./master/404";
import Login from "./master/Login";
import FullLoader from "./master/FullLoader";
import { mapGetters } from "vuex";

export default {
  components: {
    appTemplate: Template,
    appFullLoader: FullLoader,
    appNotFound: NotFound,
    appLogin: Login,
  },

  computed: {
    ...mapGetters({
      fullLoader: "getFullLoader",
      isNotFound: "getNotFound",
      isLogged: "getIsLogged",
      session: "getSession",
    }),
  },

  async created() {
    if (localStorage.getItem("token"))
      await this.$store.dispatch("auth/reconnect");
    else {
      this.$router.push({ name: "Base" }).catch((err) => {});
      this.$store.commit("setFullLoader", false);
    }

    if (
      Object.keys(this.session).length > 0 &&
      typeof this.$route.meta.module_id != "undefined" &&
      !this.session.modules.includes(this.$route.meta.module_id)
    )
      this.$router.push({ name: "Page Not Found" }).catch((err) => {});

    this.sockets.subscribe("UserManagementSave", ({ data }) => {
      if (this.session?.referenceId == data.referenceId) {
        const modules = this.session.modules;
        this.$store.commit("setSession", { ...data, modules });
      }
    });
  },

  destroyed() {
    this.sockets.unsubscribe("UserManagementSave");
  },
};
</script>

<style>
.navbar-top.border-bottom.navbar-dark {
  border-color: #fff !important;
}
.page-item.active .page-link {
  border-color: #f5365c;
  background-color: #f5365c;
}

.bootstrap-select > select.mobile-device:focus + .dropdown-toggle,
.bootstrap-select .dropdown-toggle:focus,
.bootstrap-select .dropdown-menu li a {
  outline: 0 !important;
}

.bootstrap-select .dropdown-menu li.selected.active {
  background: #f5365c;
}

.bootstrap-select .dropdown-menu li.selected.active a {
  color: #fff;
}

.bootstrap-select .btn:hover {
  transform: initial;
}

.form-control:focus {
  border-color: #2dce89;
}

.form-control {
  height: 43px !important;
  color: #000 !important;
}

.jv-error {
  color: #f5365c;
}

.breadcrumb-dark .breadcrumb-item + .breadcrumb-item::before {
  color: #fff;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: ">";
}

.form-control.form-control-alternative {
  border: 1px solid #2dce89 !important;
}

.form-control:disabled,
.form-control[readonly] {
  background-color: #fff;
}

.no-data-found {
  padding: 50px 0;
}

.input-group-alternative {
  border: 1px solid #dee2e6;
}

.input-group-alternative i.fas.fa-search,
.input-group-alternative i.fas.fa-search {
  color: #f5365c;
}

.popover-error-section {
  color: red;
}

td {
  font-weight: bold;
  font-size: 15px !important;
}

body::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

body::-webkit-scrollbar {
  height: 10px;
  width: 10px;
  background-color: #f5f5f5;
}

body::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5365c;
}

.table-responsive::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

.table-responsive::-webkit-scrollbar {
  height: 10px;
  width: 10px;
  background-color: #f5f5f5;
}

.table-responsive::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5365c;
}

.modal .close {
  opacity: 1 !important;
}

.modal .close-icon {
  color: #f5365c !important;
}

body {
  padding-right: 0 !important;
}

pre.p-4.code-section {
  max-height: calc(100vh - 350px);
}

pre.p-4.code-section::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

pre.p-4.code-section::-webkit-scrollbar {
  height: 10px;
  width: 10px;
  background-color: #f5f5f5;
}

pre.p-4.code-section::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5365c;
}

.datepicker {
  z-index: 999999999 !important;
}

.modal-body {
  max-height: calc(100vh - 215px) !important;
  overflow-y: auto;
}

.modal-body {
  max-height: calc(100vh - 350px);
}

.modal-body::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

.modal-body::-webkit-scrollbar {
  height: 10px;
  width: 10px;
  background-color: #f5f5f5;
}

.modal-body::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5365c;
}

.colored-scroll::-webkit-scrollbar {
  height: 10px;
  width: 10px;
  background-color: #f5f5f5;
}

.colored-scroll::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5365c;
}

.dropdown-menu .inner::-webkit-scrollbar {
  height: 10px;
  width: 10px;
  background-color: #f5f5f5;
}

.dropdown-menu .inner::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5365c;
}

textarea.textarea_auto {
  height: auto !important;
}
</style>
