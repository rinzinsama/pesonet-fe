<template>
  <div>
    <div class="modal-body">
      <div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">API URL</label>
              <input
                type="text"
                class="form-control"
                v-model="settings.url"
                readonly="true"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">API PATH</label>
              <input
                type="text"
                class="form-control"
                v-model="settings.path"
                readonly="true"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">PASSPHRASE</label>
              <div class="input-group">
                <input
                  :type="isPassphraseLocked ? 'password' : 'text'"
                  class="form-control"
                  v-model="settings.passphrase"
                  readonly="true"
                />
                <div class="input-group-append">
                  <span class="input-group-text text-center"
                    ><i
                      :class="
                        isPassphraseLocked ? 'far fa-eye' : 'far fa-eye-slash'
                      "
                      @click.prevent="updateLockStatus('isPassphraseLocked')"
                    ></i
                  ></span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-control-label">API KEY</label>
              <div class="input-group">
                <input
                  :type="isAPIKeyLocked ? 'password' : 'text'"
                  class="form-control"
                  v-model="settings.apiKey"
                  readonly="true"
                />
                <div class="input-group-append">
                  <span class="input-group-text text-center"
                    ><i
                      :class="
                        isAPIKeyLocked ? 'far fa-eye' : 'far fa-eye-slash'
                      "
                      @click.prevent="updateLockStatus('isAPIKeyLocked')"
                    ></i
                  ></span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-control-label">SECRET KEY</label>
              <div class="input-group">
                <input
                  :type="isSecretKeyLocked ? 'password' : 'text'"
                  class="form-control"
                  v-model="settings.secretKey"
                  readonly="true"
                />
                <div class="input-group-append">
                  <span class="input-group-text text-center"
                    ><i
                      :class="
                        isSecretKeyLocked ? 'far fa-eye' : 'far fa-eye-slash'
                      "
                      @click.prevent="updateLockStatus('isSecretKeyLocked')"
                    ></i
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6 py-5">
            <div
              class="file-container text-center"
              v-for="(file, index) in settings.files"
              :key="index"
            >
              <i class="fas fa-file-code"></i>
              <span class="label mt-1">{{ file }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-success" @click.prevent="update">
        UPDATE
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPassphraseLocked: true,
      isAPIKeyLocked: true,
      isSecretKeyLocked: true,
    };
  },

  props: ["preview", "title", "settings"],

  methods: {
    update() {
      this.$emit("update:preview", "update");
      this.$emit("update:title", "UPDATE SETTINGS");
    },

    updateLockStatus(locked) {
      this[locked] = !this[locked];
    },
  },
};
</script>

<style scoped>
.file-container {
  width: 33%;
  display: inline-block;
}

.file-container i {
  font-size: 170px;
  color: #f5365c;
  cursor: pointer;
}

.file-container .label {
  display: block;
}

.input-group-text i {
  font-size: 20px;
  color: #f5365c;
  cursor: pointer;
}

.input-group-text {
  width: 50px;
}
</style>
