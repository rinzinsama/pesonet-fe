<template>
  <div class="card mb-4">
    <div class="card-body">
      <div v-if="isLoading == 1">
        <div class="row">
          <div class="col-md-12 pt-3 pb-3">
            <app-loader />
          </div>
        </div>
      </div>
      <form class="create-bank-config" v-if="isLoading == 0">
        <div class="row">
          <div class="col-lg-6">
            <div class="form-group focused">
              <label class="form-control-label">BANK BIC</label>
              <select
                class="selectpicker"
                data-style="btn-danger"
                data-live-search="true"
                data-width="100%"
                v-model="bank"
              >
                <option
                  v-for="(bank, key) in banks"
                  :value="bank.BICFI"
                  :key="key"
                  >{{ bank.BICFI }}</option
                >
              </select>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">BANK NAME</label>
              <input
                type="text"
                class="form-control"
                name="bankName"
                :value="bankName"
                readonly="true"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <h2>PCHC</h2>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">BANK CODE</label>
              <input
                type="text"
                class="form-control"
                name="bankCode"
                :value="bankCode"
                readonly="true"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">HEAD OFFICE BRSTN</label>
              <input
                type="text"
                class="form-control"
                name="brstn"
                :value="brstn"
                readonly="true"
              />
            </div>
          </div>
        </div>

        <hr class="my-3" />

        <div class="text-right">
          <button
            type="button"
            class="btn btn-success"
            @click.prevent="updateBank"
          >
            SUBMIT
          </button>
        </div>
      </form>
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
      isLoading: 1,
      bank: 0,
      banks: [],
      bankName: "",
      bankCode: "",
      brstn: "",
    };
  },

  watch: {
    banks: function(newVal) {
      this.$nextTick(() => {
        $(".selectpicker").selectpicker("refresh");
      });
    },

    bank: function(newVal) {
      const bank = this.banks.find((bank) => bank.BICFI == newVal);
      this.bankName = bank.bank_name;
      this.bankCode = bank.pchc.bank_code;
      this.brstn = bank.pchc.head_office_brstn;
    },
  },

  methods: {
    updateBank() {
      const vm = this;

      let payload = {
        bic: this.bank,
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: "UPDATE BANK",
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

              vm.$store.dispatch("banklist/updateBank", payload).then((res) => {
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

                if (status == 200) JCinstance.$$close.show();
                else {
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

    async getBanks() {
      this.isLoading = 1;
      const [
        { status: bankListStatus, data: bankListData },
        { status: bicStatus, data: bicData },
      ] = await Promise.all([
        await this.$store.dispatch("banklist/getBankList"),
        await this.$store.dispatch("banklist/getBankBIC"),
      ]);

      this.banks = bankListData ? bankListData.PESONetMemberBanks : [];
      this.bank = bicData || 0;
      this.isLoading = 0;
    },
  },

  async created() {
    await this.getBanks();

    this.sockets.subscribe("BankListUpdate", async (data) => {
      this.bank = data ? data.data : 0;
      $(".selectpicker").selectpicker("refresh");
    });
  },

  destroyed() {
    this.sockets.unsubscribe("BankListUpdate");
  },
};
</script>
