<template>
  <div>
    <app-sidebar />
    <div class="main-content" id="panel">
      <app-topbar />
      <app-header />
      <div class="container-fluid mt--6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import Topbar from "./Topbar.vue";
import Header from "./Header.vue";
// import Footer from "./Footer.vue";
// import { mapGetters } from "vuex";

export default {
  components: {
    appSidebar: Sidebar,
    appTopbar: Topbar,
    appHeader: Header
    // appFooter: Footer
  },

  mounted() {
    $("body").removeClass();

    if (Cookies.get("sidenav-state") == "pinned")
      $("body")
        .addClass("g-sidenav-show")
        .addClass("g-sidenav-pinned");
    else $("body").addClass("g-sidenav-hidden");
  }
};
</script>
