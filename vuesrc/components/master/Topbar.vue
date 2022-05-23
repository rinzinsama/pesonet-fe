<template>
  <nav
    class="navbar navbar-top navbar-expand navbar-dark bg-danger border-bottom"
  >
    <div class="container-fluid">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!-- Navbar links -->
        <ul class="navbar-nav align-items-center ml-md-auto">
          <li class="nav-item d-xl-none">
            <!-- Sidenav toggler -->
            <div
              class="pr-3 sidenav-toggler sidenav-toggler-dark active"
              data-action="sidenav-pin"
              data-target="#sidenav-main"
            >
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
              </div>
            </div>
          </li>
        </ul>
        <ul class="navbar-nav align-items-center ml-auto ml-md-0">
          <li class="nav-item dropdown">
            <a
              class="nav-link pr-0"
              href="#"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <div class="media align-items-center">
                <div class="media-body ml-2 d-none d-lg-block">
                  <span class="mb-0 text-sm  font-weight-bold">{{ name }}</span>
                </div>
              </div>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <a href="" @click.prevent="goToProfile" class="dropdown-item">
                <i class="fas fa-user-circle text-danger"></i>
                <span>Profile</span>
              </a>
              <a href="#!" @click.prevent="logout" class="dropdown-item logout">
                <i class="fas fa-power-off text-danger"></i>
                <span class="logout">Logout</span>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      session: "getSession",
    }),

    name() {
      return this.session.fullname;
    },
  },

  methods: {
    async logout() {
      await this.$store.dispatch("auth/logout");
    },

    goToProfile() {
      this.$router.push({ name: "Profile" }).catch((err) => {});
    },
  },
};
</script>
