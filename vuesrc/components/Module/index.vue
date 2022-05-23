<template>
  <div class="card">
    <div class="card-header border-0">
      <app-loader v-if="isLoading == 1" />
      <div class="row align-items-center">
        <div div class="col-md-2 offset-md-10 text-right" v-if="isLoading == 0">
          <select
            class="selectpicker ignore justify-content-end"
            data-style="btn-danger"
            data-width="100%"
            v-model="role"
            @change="getRoleModules"
          >
            <option v-for="(role, key) in roles" :value="role.id" :key="key">{{
              role.role
            }}</option>
          </select>
        </div>
      </div>
    </div>
    <div v-if="isLoading == 1 || isChangedLoading == 1">
      <div class="row">
        <div class="col-md-12 pt-3 pb-3">
          <app-loader />
        </div>
      </div>
    </div>
    <div v-if="modules.length == 0 && isLoading == 0 && isChangedLoading == 0">
      <div class="row">
        <div class="col-md-12 text-center no-data-found">
          <h1>No data found.</h1>
        </div>
      </div>
    </div>
    <div
      class="table-responsive"
      v-if="isLoading == 0 && isChangedLoading == 0 && modules.length > 0"
    >
      <table class="table align-items-center table-flush">
        <thead class="thead-light">
          <tr>
            <th scope="col" class="width45">MODULE</th>
            <th scope="col" class="width45">DESCRIPTION</th>
            <th scope="col" class="width10">ALLOWED</th>
          </tr>
        </thead>
        <tbody class="list">
          <tr v-for="(module, key) in modules" :key="key">
            <td>{{ module.module }}</td>
            <td>{{ module.description }}</td>
            <td>
              <div
                class="custom-control custom-control-alternative custom-checkbox mb-3"
              >
                <input
                  class="custom-control-input"
                  :id="module.module"
                  type="checkbox"
                  :checked="getCheckBoxValue(module.module)"
                  @change="updateCheckboxValue(module.module)"
                />
                <label
                  class="custom-control-label"
                  :for="module.module"
                ></label>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="card-footer py-3 text-right"
      v-if="isLoading == 0 && isChangedLoading == 0 && modules.length > 0"
    >
      <button
        type="button"
        class="btn btn-success"
        @click.prevent="updateModules"
      >
        UPDATE
      </button>
    </div>
  </div>
</template>

<script>
import Loader from "../master/Loader";

export default {
  components: {
    appLoader: Loader,
  },

  data() {
    return {
      role: 0,
      roles: [],
      isLoading: 1,
      isChangedLoading: 1,
      modules: [],
      activeModules: [],
    };
  },

  watch: {
    roles: function(newVal) {
      this.$nextTick(() => $(".selectpicker").selectpicker("refresh"));
    },
  },

  methods: {
    async getData() {
      const [{ data: roleData }, { data: moduleData }] = await Promise.all([
        await this.$store.dispatch("role/getRoles"),
        await this.$store.dispatch("module/getModules", { status: 1 }),
      ]);

      this.roles = roleData || [];
      this.role = localStorage.getItem("ModuleRole") || roleData?.[0]?.id || 0;
      this.modules = moduleData || [];

      this.isLoading = 0;

      await this.getRoleModules();
    },

    async getRoleModules() {
      this.isChangedLoading = 1;

      localStorage.setItem("ModuleRole", this.role);

      const { data } = await this.$store.dispatch("module/getRoleModules", {
        id: this.role,
      });

      this.activeModules = data || [];
      this.isChangedLoading = 0;
    },

    getCheckBoxValue(module) {
      return this.activeModules.includes(+module);
    },

    updateCheckboxValue(module) {
      if (this.activeModules.includes(+module))
        this.activeModules = this.activeModules.filter(
          (activeModules) => activeModules != +module
        );
      else this.activeModules.push(+module);
    },

    async updateModules() {
      let vm = this;

      let payload = {
        id: this.role,
        modules: this.activeModules,
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: "UPDATE MODULE",
        content: "",
        buttons: {
          submit: {
            text: "submit",
            btnClass: "btn-success",
            keys: ["enter"],
            action() {
              let JCinstance = this;

              JCinstance.$$submit.hide();
              JCinstance.$$cancel.hide();

              JCinstance.setContent("Processing....");
              JCinstance.setIcon("fas fa-circle-notch fa-pulse");

              vm.$store.dispatch("module/updateModule", payload).then((res) => {
                const { status, message, errors } = res;

                JCinstance.setIcon(
                  status == 200
                    ? "far fa-check-circle"
                    : "fas fa-exclamation-triangle"
                );

                JCinstance.setContent(
                  status == 200
                    ? message
                    : `<b>${message}</b> <br /> ${errors.join("<br />")}`
                );

                if (status == 200) {
                  JCinstance.$$close.show();
                } else {
                  JCinstance.$$submit.show();
                  JCinstance.$$cancel.show();
                }
              });
              return false;
            },
          },
          cancel: {
            text: "Cancel",
            btnClass: "btn-danger",
          },
          close: {
            text: "Close",
            btnClass: "btn-info",
            isHidden: true,
          },
        },
      });
    },
  },

  async created() {
    await this.getData();

    this.sockets.subscribe("ModuleSave", (data) => {
      if (this.role == data.roleId)
        this.activeModules = data.modules || [];
    });
  },

  destroyed() {
    this.sockets.unsubscribe("ModuleSave");
    localStorage.removeItem("ModuleRole");
  },
};
</script>

<style scoped>
.width45 {
  width: 45%;
}

.width10 {
  width: 10%;
}

.custom-control-alternative .custom-control-label::before {
  border: 1px solid black;
}

.custom-control-label::before {
  width: 2rem;
  height: 2rem;
}

.custom-control-label::after {
  width: 2rem;
  height: 2rem;
}
</style>
