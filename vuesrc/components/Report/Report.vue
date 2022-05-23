<template>
  <div class="card mb-4">
    <div class="card-body">
      <div class="row mb-4">
        <div
          class="col-lg-4"
          v-for="(report, idx) in reports"
          :key="idx"
          @click="goToLink(report.link)"
        >
          <div class="card card-stats bg-gradient-danger pointer">
            <div class="card-body">
              <div class="row">
                <div class="col label-col">
                  <h3
                    class="card-title text-uppercase text-muted mb-0 text-white"
                  >
                    {{ report.name }}
                  </h3>
                </div>
                <div class="col-auto">
                  <div
                    class="icon icon-shape rounded-circle shadow bg-white text-danger"
                  >
                    <i :class="report.icon"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reports: [
        {
          name: "OUTWARD TRANSACTIONS",
          icon: "fas fa-outdent",
          link: "Outward Transactions",
        },
        {
          name: "INWARD TRANSACTIONS",
          icon: "fas fa-indent",
          link: "Inward Transactions",
        },
        {
          name: "DAILY CONSOLIDATED REPORT",
          icon: "fas fa-table",
          link: "Daily Consolidated Report",
        },
      ],
    };
  },

  methods: {
    goToLink(link) {
      this.$router.push({ name: link });
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
