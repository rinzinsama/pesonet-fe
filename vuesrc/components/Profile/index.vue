<template>
  <div class="card mb-4">
    <div class="card-header">
      <div class="text-right">
        <button type="button" class="btn btn-warning" @click="changePassword">
          CHANGE PASSWORD
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">REFERENCE ID</label>
            <input
              type="text"
              class="form-control"
              name="referenceId"
              :value="session.referenceId"
              readonly="true"
            />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">USERNAME</label>
            <input
              type="text"
              class="form-control"
              name="username"
              :value="session.username"
              readonly="true"
            />
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">EMAIL</label>
            <input
              type="text"
              class="form-control"
              name="email"
              :value="session.email"
              readonly="true"
            />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">FIRST NAME</label>
            <input
              type="text"
              class="form-control"
              name="firstname"
              :value="session.firstName"
              readonly="true"
            />
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">LAST NAME</label>
            <input
              type="text"
              class="form-control"
              name="lastname"
              :value="session.lastName"
              readonly="true"
            />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">MIDDLE NAME</label>
            <input
              type="text"
              class="form-control"
              name="middlename"
              :value="session.middleName"
              readonly="true"
            />
          </div>
        </div>

        <div class="col-lg-6">
          <div class="form-group">
            <label class="form-control-label">STATUS</label>
            <input
              type="text"
              class="form-control"
              name="middlename"
              :value="getStatus"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      session: "getSession",
    }),

    getStatus() {
      return this.session.status == 1 ? "ACTIVE" : "INACTIVE";
    },
  },

  methods: {
    changePassword() {
      this.$router.push({ name: "Change Password" });
    },
  },
};
</script>
