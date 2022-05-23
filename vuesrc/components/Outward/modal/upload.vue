<template>
  <div>
    <div class="modal-body">
      <div
        class="col-md-12 drop-site"
        @dragover.prevent
        @drop.prevent.stop="onDrop"
        @click="addFile"
      >
        <input type="file" id="file-container" @change="onFileChange" />
        <div id="fileupload"></div>
        <div class="label-drop" v-if="!file">
          DROP OUTWARD FILE OR CLICK TO UPLOAD
        </div>
        <div class="file-section py-3 px-2" v-if="file">
          <i class="fas fa-file-code file-icon"></i>
          <div class="file-info-section ml-4">
            <span class="file-detail"><b>FILENAME:</b> {{ file.name }}</span>
            <span class="file-detail"
              ><b>SIZE: </b>{{ getSize(file.size) }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-success" @click.prevent="upload">
        UPLOAD
      </button>
    </div>
  </div>
</template>

<script>
import filesize from "filesize";

export default {
  data() {
    return {
      file: null,
    };
  },

  props: ["changeView", "closeMdl"],

  methods: {
    getSize(size) {
      return filesize(size);
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

      if (!/(\.|\/)(txt)$/i.test(files[0].name)) {
        this.popUpInvalid("Only .txt file is allowed.", true);
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

    async upload() {
      const vm = this;

      let formData = new FormData();
      formData.append("outward_message", this.file);

      if (this.file) {
        this.$popover({
          icon: "far fa-question-circle",
          title: "UPLOAD",
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

                vm.$store
                  .dispatch("outward/uploadOutward", formData)
                  .then((res) => {
                    const { status, message, errors } = res;

                    JCinstance.setIcon(
                      status == 200
                        ? "far fa-check-circle"
                        : "fas fa-exclamation-triangle"
                    );

                    JCinstance.setContent(
                      status == 200
                        ? message
                        : `<b>${message}</b> <br /> ${errors ? errors.join("<br />") : ""}`
                    );

                    if (status == 200) {
                      JCinstance.$$close.show();
                      vm.$emit("update:closeMdl", 1);
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
      } else {
        this.$popover({
          icon: "fas fa-exclamation-triangle",
          title: "Warning!",
          content: `Please drop/select a file to upload!`,
          buttons: {
            ok: {
              text: "ok",
              btnClass: "btn-success",
              keys: ["enter"],
            },
          },
        });
      }
    },
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
  font-size: 20px;
}
</style>
