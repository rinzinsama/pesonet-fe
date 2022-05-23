<template>
  <nav
    class="sidenav navbar navbar-vertical fixed-left navbar-expand-xs navbar-light bg-white"
    id="sidenav-main"
  >
    <div class="scroll-wrapper scrollbar-inner" style="position: relative;">
      <div
        class="scrollbar-inner scroll-content"
        style="height: 946px; margin-bottom: 0px; margin-right: 0px; max-height: none;"
      >
        <!-- Brand -->
        <div class="sidenav-header d-flex align-items-center">
          <a class="navbar-brand" href="/dashboard">
            <img
              :src="`${baseUrl}/img/mufg_logo.png`"
              class="navbar-brand-img"
              alt="MUFG"
            />
            <b id="ml10">PESONET</b>
          </a>
          <div class="ml-auto">
            <div
              class="sidenav-toggler d-none d-xl-block"
              :class="{ active: sidenav }"
              data-action="sidenav-unpin"
              data-target="#sidenav-main"
            >
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="navbar-inner">
          <div class="collapse navbar-collapse" id="sidenav-collapse-main">
            <ul class="navbar-nav">
              <router-link
                v-for="(link, index) in activeLinks"
                :key="index"
                :to="{ name: link.link }"
                tag="li"
                active-class="active"
                exact
                class="nav-item"
                :class="{ active: subIsActive(link.activeClass) }"
              >
                <a
                  class="nav-link"
                  :class="{ active: subIsActive(link.activeClass) }"
                >
                  <i :class="link.icon"></i>
                  <span class="nav-link-text"
                    ><b>{{ link.label }}</b></span
                  >
                </a>
              </router-link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      baseUrl: "getBaseUrl",
      session: "getSession",
    }),

    sidenav() {
      return Cookies.get("sidenav-state") == "pinned" ? true : false;
    },

    activeLinks() {
      return this.links.filter((link) =>
        this.session.modules.includes(link.module)
      );
    },
  },

  data() {
    return {
      links: [
        {
          module: 0,
          link: "Dashboard",
          activeClass: ["Dashboard"],
          label: "Dashboard",
          icon: "fas fa-tachometer-alt",
        },
        {
          module: 100,
          link: "Users",
          activeClass: ["Users", "Create User", "Update User"],
          label: "USER",
          icon: "fas fa-users",
        },
        {
          module: 800,
          link: "Bank List",
          activeClass: ["Bank List"],
          label: "BANK LIST",
          icon: "fas fa-hotel",
        },
        // {
        //   module: 900,
        //   link: "Inward",
        //   activeClass: ["Inward"],
        //   label: "INWARD",
        //   icon: "fas fa-envelope-open-text",
        // },
        {
          module: 900,
          link: "Inward V2",
          activeClass: ["Inward V2"],
          label: "INWARD V2",
          icon: "fas fa-envelope-open-text",
        },
        {
          module: 1000,
          link: "Outward",
          activeClass: ["Outward"],
          label: "OUTWARD",
          icon: "fas fa-mail-bulk",
        },
        {
          module: 1300,
          link: "Transaction List",
          activeClass: ["Transaction List"],
          label: "TRANSACTION LIST",
          icon: "fas fa-list-ol",
        },
        {
          module: 1400,
          link: "Report",
          activeClass: [
            "Report",
            "Outward Transactions",
            "Inward Transactions",
            "Daily Consolidated Report",
          ],
          label: "REPORT",
          icon: "fas fa-database",
        },
        {
          module: 600,
          link: "API",
          activeClass: ["API"],
          label: "API",
          icon: "fas fa-network-wired",
        },
        // {
        //   module: 400,
        //   link: "File Reader",
        //   activeClass: ["File Reader"],
        //   label: "FILE READER",
        //   icon: "far fa-folder-open",
        // },
        {
          module: 1200,
          link: "Bank",
          activeClass: ["Bank"],
          label: "BANK",
          icon: "fas fa-hotel",
        },
        // {
        //   module: 700,
        //   link: "Scheduler",
        //   activeClass: ["Scheduler"],
        //   label: "SCHEDULER",
        //   icon: "far fa-calendar-alt",
        // },
        {
          module: 1100,
          link: "Status Lists",
          activeClass: ["Status Lists", "Create Status", "Update Status"],
          label: "STATUS LIST",
          icon: "far fa-list-alt",
        },
        // {
        //   module: 300,
        //   link: "Module",
        //   activeClass: ["Module"],
        //   label: "MODULE",
        //   icon: "fas fa-user-check",
        // },
        {
          module: 500,
          link: "Enable Outward Processing",
          activeClass: ["Enable Outward Processing"],
          label: "OUTWARD",
          icon: "fas fa-mail-bulk",
        },
        {
          module: 500,
          link: "Audit Trail",
          activeClass: ["Audit Trail"],
          label: "AUDIT TRAIL",
          icon: "fas fa-clipboard-list",
        },
        {
          module: 200,
          link: "Profile",
          activeClass: ["Profile"],
          label: "PROFILE",
          icon: "fas fa-user-circle",
        },
      ],
    };
  },

  methods: {
    subIsActive(input) {
      const paths = Array.isArray(input) ? input : [input];
      return paths.some((path) => {
        return this.$route.name === path;
      });
    },
  },
};
</script>

<style scoped>
#ml10 {
  margin-left: 10px !important;
}
</style>

<style>
.navbar-vertical.navbar-expand-xs .navbar-nav > .nav-item > .nav-link.active {
  background: #f5365c;
}
a.nav-link.active {
  color: #fff !important;
}

.nav-link-text b {
  white-space: nowrap;
}
</style>
