<template>
  <div>
    <app-api-settings />
    <!-- <app-api-endpoints /> -->
    <app-api-logs />
  </div>
</template>

<script>
import APISettings from "./APISettings";
// import APIEndpoints from "./APIEndpoints";
import APILogs from "./APILogs";

export default {
  components: {
    appApiSettings: APISettings,
    // appApiEndpoints: APIEndpoints,
    appApiLogs: APILogs,
  },
};
</script>
