<template>
  <div class="card mb-4">
    <div class="card-header">
      <div class="row">
        <div class="col"><b>DROP LOGS</b></div>
      </div>
      <div class="row">
        <div class="col">
          <div class="nav-wrapper">
            <ul
              class="nav nav-pills nav-fill flex-column flex-md-row"
              id="tabs-icons-text"
              role="tablist"
            >
              <li class="nav-item">
                <a
                  @click="setActive('TIMELINE')"
                  class="nav-link mb-sm-3 mb-md-0"
                  :class="{ 'bg-danger active': active == 'TIMELINE' }"
                  role="tab"
                  aria-selected="true"
                  ><i class="far fa-calendar-alt"></i> TIMELINE</a
                >
              </li>
              <li class="nav-item">
                <a
                  @click="setActive('TABLE')"
                  class="nav-link mb-sm-3 mb-md-0"
                  :class="{ 'bg-danger active': active == 'TABLE' }"
                  role="tab"
                  aria-selected="false"
                  ><i class="fas fa-table"></i> TABLE</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <app-timeline v-if="active == 'TIMELINE'" />
    <app-table v-if="active == 'TABLE'" />
  </div>
</template>

<script>
import Timeline from "../FileReader/Timeline";
import Table from "../FileReader/Table";

export default {
  components: {
    appTimeline: Timeline,
    appTable: Table
  },

  data() {
    return {
      active: localStorage.getItem("FileReaderTabs") || "TIMELINE"
    };
  },

  methods: {
    setActive(active) {
      localStorage.setItem("FileReaderTabs", active);
      this.active = active;
    }
  },

  destroyed() {
    localStorage.removeItem("FileReaderTabs");
  }
};
</script>

<style scoped>
.nav-item {
  cursor: pointer;
}

.nav-item a {
  font-weight: bold;
}
</style>
