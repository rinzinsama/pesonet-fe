<template>
  <div class="header bg-danger pb-6">
    <div class="container-fluid">
      <div class="header-body">
        <div class="row align-items-center py-4">
          <div class="col-lg-6 col-7">
            <h6 class="h2 text-white d-inline-block mb-0">{{ name }}</h6>
            <nav
              aria-label="breadcrumb"
              class="d-none d-md-inline-block ml-md-4"
            >
              <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                <li class="breadcrumb-item">
                  <a href="#" @click.prevent><i class="fas fa-home"></i></a>
                </li>
                <li
                  class="breadcrumb-item"
                  v-for="(crumb, key) in breadcrumb"
                  :key="key"
                >
                  <a href="#" @click.prevent>{{ crumb }}</a>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    name() {
      return this.$route.name?.toUpperCase() || "";
    },

    breadcrumb() {
      let paths = this.$route.path?.split("/").filter(Boolean) || [];
      if (paths.length > 0) {
        Object.keys(this.$route.params).forEach(key => {
          paths.pop();
        });
        paths.pop();
        paths.push(this.$route.name);
        paths = paths.map(path => path.toUpperCase());
      }

      return paths;
    }
  }
};
</script>
