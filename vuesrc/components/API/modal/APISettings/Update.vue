<template>
  <div>
    <div class="modal-body">
      <form class="update-settings">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">API URL</label>
              <input
                type="text"
                class="form-control"
                name="url"
                v-model="url"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">API PATH</label>
              <input
                type="text"
                class="form-control"
                name="path"
                v-model="path"
              />
            </div>
          </div>
        </div>

        <div class="row pr-3">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">PASSPHRASE</label>
              <div class="input-group">
                <input
                  :type="isPassphraseLocked ? 'password' : 'text'"
                  class="form-control"
                  name="passphrase"
                  v-model="passphrase"
                />
                <div class="input-group-append">
                  <span class="input-group-text"
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
                  name="apiKey"
                  v-model="apiKey"
                />
                <div class="input-group-append">
                  <span class="input-group-text"
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
                  name="secretKey"
                  v-model="secretKey"
                />
                <div class="input-group-append">
                  <span class="input-group-text"
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

          <div
            class="col-md-6 drop-site"
            @dragover.prevent
            @drop.prevent.stop="onDrop"
            @click="addFile"
          >
            <input type="file" id="file-container" @change="onFileChange" />
            <div id="fileupload"></div>
            <div class="label-drop" v-if="!file">
              DROP (.PEM or .P12) FILE OR CLICK TO UPLOAD
            </div>
            <div class="file-section py-3 px-2" v-if="file">
              <i class="fas fa-file-code file-icon"></i>
              <div class="file-info-section ml-4">
                <span class="file-detail"
                  ><b>FILENAME:</b> {{ file.name }}</span
                >
                <span class="file-detail"
                  ><b>SIZE: </b>{{ getSize(file.size) }}</span
                >

                <p class="mt-4">
                  This file will be processed into:
                  <span class="file-detail" v-if="isPEM(file.name)"
                    ><b>*pesonet.crt</b></span
                  >
                  <span class="file-detail" v-if="isPEM(file.name)"
                    ><b>*pesonet.key</b></span
                  >
                  <span class="file-detail" v-if="!isPEM(file.name)"
                    ><b>*pesonet.p12</b></span
                  >
                </p>
                <p class="mt-4">
                  {{ isPEM(file.name) ? 'CRT and KEY' : 'P12' }} will be used to connect to PESONET API
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-warning" @click.prevent="back">
        BACK
      </button>
      <button type="button" class="btn btn-success" @click.prevent="submit">
        SUBMIT
      </button>
    </div>
  </div>
</template>

<script>
import filesize from "filesize";

export default {
  data() {
    return {
      url: "",
      path: "",
      passphrase: "",
      apiKey: "",
      secretKey: "",
      file: null,
      isPassphraseLocked: true,
      isAPIKeyLocked: true,
      isSecretKeyLocked: true,
    };
  },

  props: ["preview", "title", "settings"],

  methods: {
    back() {
      this.$emit("update:preview", "view");
      this.$emit("update:title", "VIEW SETTINGS");
    },

    getSize(size) {
      return filesize(size);
    },

    isPEM(filename) {
      const ext = filename
        .split(".")
        .pop()
        .toLowerCase();

      return ext == 'pem' ? true : false;
    },

    async uploadData() {
      let payload = {
        url: this.url,
        passphrase: this.passphrase,
        apiKey: this.apiKey,
        secretKey: this.secretKey,
        path: this.path,
        hasUpload: this.file ? 1 : 0,
      };

      return new Promise(async (resolve, reject) => {
        const res = await this.$store.dispatch(
          "api/updateAPISettings",
          payload
        );
        resolve(res);
      });
    },

    async uploadCreds() {
      let formData = new FormData();
      formData.append("certificate", this.file);

      return new Promise(async (resolve, reject) => {
        const { status, message } = await this.$store.dispatch(
          "api/uploadCreds",
          formData
        );
        if (status == 200) {
          const res = await this.uploadData();
          resolve(res);
        } else resolve({ status, message });
      });
    },

    async submit() {
      const valid = $(".update-settings").valid();
      const vm = this;

      if (!valid) return;

      this.$popover({
        icon: "far fa-question-circle",
        title: "UPDATE API SETTINGS",
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

              if (vm.file)
                vm.uploadCreds().then((res) => {
                  const { status, message, errors } = res;

                  JCinstance.setIcon(
                    status == 200
                      ? "far fa-check-circle"
                      : "fas fa-exclamation-triangle"
                  );

                  JCinstance.setContent(
                    status == 200
                      ? message
                      : `<b>${message}</b>${
                          errors ? "<br />" + errors.join("<br />") : ""
                        }`
                  );

                  if (status == 200) {
                    JCinstance.$$close.show();
                    vm.back();
                  } else {
                    JCinstance.$$submit.show();
                    JCinstance.$$cancel.show();
                  }
                });
              else
                vm.uploadData().then((res) => {
                  const { status, message, errors } = res;

                  JCinstance.setIcon(
                    status == 200
                      ? "far fa-check-circle"
                      : "fas fa-exclamation-triangle"
                  );

                  JCinstance.setContent(
                    status == 200
                      ? message
                      : `<b>${message}</b>${
                          errors ? "<br />" + errors.join("<br />") : ""
                        }`
                  );

                  if (status == 200) {
                    JCinstance.$$close.show();
                    vm.back();
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

    updateLockStatus(locked) {
      this[locked] = !this[locked];
    },

    onDrop(e) {
      var files = e.dataTransfer.files;

      if (Object.keys(files).length > 1) {
        this.popUpInvalid("Please drop one file only.", true);
        return;
      }

      this.createFile(files);
    },

    createFile(files) {
      let vm = this;
      this.file = null;

      if (!/(\.|\/)(pem|p12)$/i.test(files[0].name)) {
        this.popUpInvalid("Only .pem or .p12 file is allowed.", true);
        return;
      }

      this.file = files[0];
    },

    popUpInvalid(message, clean) {
      this.$popover({
        title: "Error",
        content: message,
        icon: "fas fa-exclamation-triangle",
        buttons: {
          ok: {
            text: "Ok",
            btnClass: "btn-success",
          },
        },
      });

      if (clean) $("#file-container").val("");
    },

    addFile() {
      $("#file-container").val("");
      $("#file-container").click();
    },

    onFileChange(e) {
      var files = e.target.files;

      if (Object.keys(files).length > 1) {
        this.popUpInvalid("Please select one file only.");
        return;
      }

      this.createFile(files);
    },
  },

  mounted() {
    Object.keys(this.settings).forEach((key) => {
      if (key != "files") this[key] = this.settings[key];
    });

    $(".update-settings").validate({
      rules: {
        url: {
          required: true,
          regex:
            "^(?:http(s)?:\\/\\/)[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$|i",
        },
        passphrase: {
          required: true,
          regex: "^[a-z0-9]*$|i",
        },
        apiKey: {
          required: true,
          regex: "^[a-z0-9]*$|i",
        },
        secretKey: {
          required: true,
          regex: "^[a-z0-9]*$|i",
        },
      },
      messages: {
        url: {
          regex: "Please input valid url format.",
        },
        passphrase: {
          regex: "Only letters and numbers are allowed.",
        },
        apiKey: {
          regex: "Only letters and numbers are allowed.",
        },
        secretKey: {
          regex: "Only letters and numbers are allowed.",
        },
      },
      errorClass: "jv-error",
      errorPlacement: function(error, element) {
        element.closest(".form-group").append(error);
      },
      highlight: (element, errorClass) => {
        $(element).addClass("is-invalid");
        $(element).removeClass("form-control-alternative");
      },
      unhighlight: (element, errorClass) => {
        $(element).removeClass("is-invalid");
        $(element).addClass("form-control-alternative");
      },
    });
  },
};
</script>

<style scoped>
.drop-site {
  border: 2px solid #f5365c;
  min-height: 250px;
  border-style: dashed;
  cursor: pointer;
}

.label-drop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  height: 30px;
}

#file-container {
  display: none;
}

.input-group-text i {
  font-size: 20px;
  color: #f5365c;
  cursor: pointer;
}

.input-group-text {
  width: 50px;
}

.file-icon {
  font-size: 258px;
  display: inline-block;
  color: #f5365c;
}

.file-info-section {
  display: inline-block;
  vertical-align: top;
}

.file-detail {
  display: block;
}
</style>
