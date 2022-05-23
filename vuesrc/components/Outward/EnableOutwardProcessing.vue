<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-md-3">
          <div class="form-group">
            <label class="form-control-label">REFERENCE ID</label>
            <input type="text" class="form-control" name="ref" v-model="ref" />
          </div>
        </div>
        <div class="col-md-2">
          <div class="form-group">
            <label class="form-control-label">&nbsp;</label>
            <br />
            <button
              type="button"
              class="btn btn-success"
              @click.prevent="searchRef"
            >
              SEARCH
            </button>
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
      ref: "",
    };
  },

  methods: {
    searchRef() {
      const vm = this;

      this.$popover({
        icon: "fas fa-circle-notch fa-pulse",
        title: "OUTWARD PROCESSING",
        content: "Processing....",
        onContentReady: function() {
          let JCinstance = this;

          vm.$store
            .dispatch("outward/checkOutwardProcessing", { referenceId: vm.ref })
            .then((res) => {
              const { status, message } = res;

              JCinstance.setContent(message);

              JCinstance.setIcon(
                status == 200
                  ? "far fa-check-circle"
                  : "fas fa-exclamation-triangle"
              );

              if (status == 200) {
                JCinstance.$$yes.show();
                JCinstance.$$no.show();
              } else JCinstance.$$close.show();
            });
        },
        buttons: {
          yes: {
            text: "yes",
            btnClass: "btn-success",
            keys: ["enter"],
            isHidden: true,
            action() {
              let JCinstance = this;

              JCinstance.$$yes.hide();
              JCinstance.$$no.hide();

              JCinstance.setContent("Processing....");
              JCinstance.setIcon("fas fa-circle-notch fa-pulse");

              vm.$store
                .dispatch("outward/enableOutwardProcessing", {
                  referenceId: vm.ref,
                })
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
                      : `<b>${message}</b> <br /> ${errors.join("<br />")}`
                  );

                  if (status == 200) {
                    JCinstance.$$close.show();
                  } else {
                    JCinstance.$$yes.show();
                    JCinstance.$$no.show();
                  }
                });

              return false;
            },
          },
          no: {
            text: "no",
            btnClass: "btn-danger",
            isHidden: true,
          },
          close: {
            text: "Close",
            btnClass: "btn-danger",
            isHidden: true,
          },
        },
      });
    },
  },
};
</script>
