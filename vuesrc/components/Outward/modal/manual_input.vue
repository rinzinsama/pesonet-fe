<template>
  <div>
    <div class="modal-body">
      <div class="col-md-12" v-if="isLoading">
        <div class="row">
          <div class="col-md-12 pt-3 pb-3">
            <app-loader />
          </div>
        </div>
      </div>

      <form class="create-outward-message-manual-form" v-if="!isLoading">
        <h3 class="text-info">HEADER</h3>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">BIC OF THE SENDING BANK</label>
              <input
                type="text"
                class="form-control"
                name="bicOfBank"
                :value="bicOfBank"
                readonly="true"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">NUMBER OF TRANSACTION/S</label>
              <input
                type="text"
                class="form-control"
                :value="transactions.length"
                readonly="true"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">TOTAL AMOUNT</label>
              <input
                type="text"
                class="form-control"
                :value="computeTotalAmount"
                readonly="true"
              />
            </div>
          </div>
        </div>

        <h3 class="my-3 text-info">
          TRANSACTIONS (<span class="text-success trans-counter">{{
            `${counter}`
          }}</span>
          -
          <span class="text-danger trans-error">{{ errorCount }} errors</span>
          -
          <span class="text-danger trans-error"
            >{{ duplicateCount }} duplicates</span
          >
          -
          <span class="text-success trans-error">{{ sentCount }} sent</span>)
        </h3>

        <div class="accordion" id="formTransactionAccordion">
          <div
            class="card mb-0"
            v-for="(transaction, index) in transactions"
            :key="index"
          >
            <div
              class="card-header  text-white"
              :class="validateObjectColor(transaction)"
              :id="`heading${index}`"
              data-toggle="collapse"
              :data-target="`#collapse${index}`"
              aria-expanded="false"
              :aria-controls="`collapse${index}`"
            >
              <div class="row">
                <div class="col">
                  <div
                    class="dont-collapse custom-control custom-control-alternative custom-checkbox mr-4 same-line"
                    v-if="!transaction.sent"
                  >
                    <input
                      class="custom-control-input transaction-checkbox"
                      :id="`checkbox-${index}`"
                      type="checkbox"
                      :value="index"
                      v-model="removeRack"
                    />
                    <label
                      class="custom-control-label"
                      :for="`checkbox-${index}`"
                    ></label>
                  </div>

                  <h3
                    class="mb-0 mr-1 text-danger same-line"
                    v-if="transaction.sent"
                  >
                    SENT
                  </h3>

                  <h3 class="mb-0 text-white same-line">
                    {{ `#${index + 1}` }}
                    {{ checkRef(transaction.ofiReferenceNumber) }}
                    {{ checkAmount(transaction.amount) }}
                    <b
                      :class="duplicateColor(transaction)"
                      v-if="!transaction.sent"
                      >{{
                        hasDuplicateMessage(
                          transaction.ofiReferenceNumber,
                          index
                        )
                      }}</b
                    >
                  </h3>
                </div>
              </div>
            </div>
            <div
              :id="`collapse${index}`"
              class="collapse"
              :aria-labelledby="`heading${index}`"
              data-parent="#formTransactionAccordion"
            >
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-control-label"
                        >OFI REFERENCE NUMBER
                        <b class="text-danger"
                          >{{
                            hasDuplicateMessage(
                              transaction.ofiReferenceNumber,
                              index
                            )
                          }}
                          <i
                            class="far fa-clone text-danger icon-popover"
                            v-show="
                              hasDuplicateBool(
                                transaction.ofiReferenceNumber,
                                index
                              )
                            "
                            data-toggle="popover"
                            title="DUPLICATE/S"
                            :data-content="
                              hasDuplicateContent(
                                transaction.ofiReferenceNumber,
                                index
                              )
                            "
                          ></i></b
                      ></label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{
                          'is-invalid': validateField(
                            transaction.ofiReferenceNumber,
                            true,
                            35
                          ),
                        }"
                        maxlength="35"
                        v-model="transaction.ofiReferenceNumber"
                        :readonly="transaction.sent ? true : false"
                      />
                      <label
                        class="jv-error"
                        v-if="
                          validateField(
                            transaction.ofiReferenceNumber,
                            true,
                            35
                          )
                        "
                        >{{
                          validateFieldError(
                            transaction.ofiReferenceNumber,
                            true,
                            35
                          )
                        }}</label
                      >
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-control-label"
                        >OFI CUSTOMER REFERENCE NUMBER</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        :class="{
                          'is-invalid': validateField(
                            transaction.ofiCustomerReferenceNumber,
                            false,
                            35
                          ),
                        }"
                        maxlength="35"
                        v-model="transaction.ofiCustomerReferenceNumber"
                        :readonly="transaction.sent ? true : false"
                      />
                      <label
                        class="jv-error"
                        v-if="
                          validateField(
                            transaction.ofiCustomerReferenceNumber,
                            false,
                            35
                          )
                        "
                        >{{
                          validateFieldError(
                            transaction.ofiCustomerReferenceNumber,
                            false,
                            35
                          )
                        }}</label
                      >
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-control-label"
                        >RFI REFERENCE NUMBER</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        :class="{
                          'is-invalid': validateField(
                            transaction.rfiReferenceNumber,
                            false,
                            35
                          ),
                        }"
                        maxlength="35"
                        v-model="transaction.rfiReferenceNumber"
                        :readonly="transaction.sent ? true : false"
                      />
                      <label
                        class="jv-error"
                        v-if="
                          validateField(
                            transaction.rfiReferenceNumber,
                            false,
                            35
                          )
                        "
                        >{{
                          validateFieldError(
                            transaction.rfiReferenceNumber,
                            false,
                            35
                          )
                        }}</label
                      >
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-control-label"
                        >RFI CUSTOMER REFERENCE NUMBER</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        :class="{
                          'is-invalid': validateField(
                            transaction.rfiCustomerReferenceNumber,
                            false,
                            35
                          ),
                        }"
                        maxlength="35"
                        v-model="transaction.rfiCustomerReferenceNumber"
                        :readonly="transaction.sent ? true : false"
                      />
                      <label
                        class="jv-error"
                        v-if="
                          validateField(
                            transaction.rfiCustomerReferenceNumber,
                            false,
                            35
                          )
                        "
                        >{{
                          validateFieldError(
                            transaction.rfiCustomerReferenceNumber,
                            false,
                            35
                          )
                        }}</label
                      >
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-control-label">AMOUNT</label>
                      <input
                        type="text"
                        class="form-control money"
                        :class="{
                          'is-invalid': validateField(
                            cleanAmount(transaction.amount),
                            true,
                            16
                          ),
                        }"
                        :value="transaction.amount"
                        @keyup="setValue($event, 'amount', index)"
                        :readonly="transaction.sent ? true : false"
                      />
                      <label
                        class="jv-error"
                        v-if="
                          validateField(
                            cleanAmount(transaction.amount),
                            true,
                            16
                          )
                        "
                        >{{
                          validateFieldError(
                            cleanAmount(transaction.amount),
                            true,
                            16
                          )
                        }}</label
                      >
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-control-label">INSTRUCTIONS</label>
                      <textarea
                        class="form-control"
                        :class="{
                          'is-invalid': validateField(
                            transaction.instructions,
                            true,
                            200
                          ),
                        }"
                        rows="5"
                        maxlength="200"
                        v-model="transaction.instructions"
                        :readonly="transaction.sent ? true : false"
                      />
                      <label
                        class="jv-error"
                        v-if="
                          validateField(transaction.instructions, true, 200)
                        "
                        >{{
                          validateFieldError(
                            transaction.instructions,
                            true,
                            200
                          )
                        }}</label
                      >
                    </div>
                  </div>
                </div>

                <div class="row mt-2">
                  <div class="col-md-12">
                    <h2 class="text-info">DEBTOR/REMITTER</h2>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-control-label"
                        >DEBTOR/REMITTER NAME</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        :class="{
                          'is-invalid': validateField(
                            transaction.remitterName,
                            true,
                            50
                          ),
                        }"
                        maxlength="50"
                        v-model="transaction.remitterName"
                        :readonly="transaction.sent ? true : false"
                      />
                      <label
                        class="jv-error"
                        v-if="validateField(transaction.remitterName, true, 50)"
                        >{{
                          validateFieldError(transaction.remitterName, true, 50)
                        }}</label
                      >
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-control-label"
                        >DEBTOR/REMITTER ADDRESS</label
                      >
                      <textarea
                        class="form-control"
                        :class="{
                          'is-invalid': validateField(
                            transaction.remitterAddress,
                            true,
                            200
                          ),
                        }"
                        rows="5"
                        maxlength="200"
                        v-model="transaction.remitterAddress"
                        :readonly="transaction.sent ? true : false"
                      />
                      <label
                        class="jv-error"
                        v-if="
                          validateField(transaction.remitterAddress, true, 200)
                        "
                        >{{
                          validateFieldError(
                            transaction.remitterAddress,
                            true,
                            200
                          )
                        }}</label
                      >
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-control-label"
                        >DEBTOR/REMITTER ACCOUNT NUMBER</label
                      >
                      <input
                        type="text"
                        class="form-control acct-numbers"
                        :class="{
                          'is-invalid': validateField(
                            transaction.remitterAccountNumber,
                            true,
                            35
                          ),
                        }"
                        maxlength="35"
                        :value="transaction.remitterAccountNumber"
                        @keyup="
                          setValue($event, 'remitterAccountNumber', index)
                        "
                        :readonly="transaction.sent ? true : false"
                      />
                      <label
                        class="jv-error"
                        v-if="
                          validateField(
                            transaction.remitterAccountNumber,
                            true,
                            35
                          )
                        "
                        >{{
                          validateFieldError(
                            transaction.remitterAccountNumber,
                            true,
                            35
                          )
                        }}</label
                      >
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-control-label"
                        >BIC OF ORIGINATING INSTITUTION</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        :value="transaction.remitterBIC"
                        readonly="true"
                      />
                    </div>
                  </div>
                </div>

                <div class="row mt-2">
                  <div class="col-md-12">
                    <h2 class="text-info">CREDITOR/BENEFICIARY</h2>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-control-label"
                        >CREDITOR/BENEFICIARY NAME</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        :class="{
                          'is-invalid': validateField(
                            transaction.beneficiaryName,
                            true,
                            50
                          ),
                        }"
                        maxlength="50"
                        v-model="transaction.beneficiaryName"
                        :readonly="transaction.sent ? true : false"
                      />
                      <label
                        class="jv-error"
                        v-if="
                          validateField(transaction.beneficiaryName, true, 50)
                        "
                        >{{
                          validateFieldError(
                            transaction.beneficiaryName,
                            true,
                            50
                          )
                        }}</label
                      >
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-control-label"
                        >CREDITOR/BENEFICIARY ADDRESS</label
                      >
                      <textarea
                        class="form-control"
                        :class="{
                          'is-invalid': validateField(
                            transaction.beneficiaryAddress,
                            false,
                            200
                          ),
                        }"
                        rows="5"
                        maxlength="200"
                        v-model="transaction.beneficiaryAddress"
                        :readonly="transaction.sent ? true : false"
                      />
                      <label
                        class="jv-error"
                        v-if="
                          validateField(
                            transaction.beneficiaryAddress,
                            false,
                            200
                          )
                        "
                        >{{
                          validateFieldError(
                            transaction.beneficiaryAddress,
                            false,
                            200
                          )
                        }}</label
                      >
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label class="form-control-label"
                        >CREDITOR/BENEFICIARY ACCOUNT NUMBER</label
                      >
                      <input
                        type="text"
                        class="form-control acct-numbers"
                        :class="{
                          'is-invalid': validateField(
                            transaction.beneficiaryAccountNumber,
                            true,
                            35
                          ),
                        }"
                        maxlength="35"
                        :value="transaction.beneficiaryAccountNumber"
                        @keyup="
                          setValue($event, 'beneficiaryAccountNumber', index)
                        "
                        :readonly="transaction.sent ? true : false"
                      />
                      <label
                        class="jv-error"
                        v-if="
                          validateField(
                            transaction.beneficiaryAccountNumber,
                            true,
                            35
                          )
                        "
                        >{{
                          validateFieldError(
                            transaction.beneficiaryAccountNumber,
                            true,
                            35
                          )
                        }}</label
                      >
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group focused">
                      <label class="form-control-label"
                        >CREDITOR/BENEFICIARY BANK BIC</label
                      >
                      <select
                        class="selectpicker"
                        data-live-search="true"
                        data-style="btn-danger"
                        data-width="100%"
                        data-size="8"
                        title="Please select BIC"
                        v-model="transaction.beneficiaryBIC"
                      >
                        <option
                          v-for="(bank, key) in activeBanks"
                          :value="bank.BICFI"
                          :key="key"
                          >{{ `${bank.BICFI} (${bank.bank_name})` }}</option
                        >
                      </select>
                      <label
                        class="jv-error"
                        v-if="
                          validateField(
                            transaction.beneficiaryBIC,
                            true,
                            -1,
                            true
                          )
                        "
                        >{{
                          validateFieldError(
                            transaction.beneficiaryBIC,
                            true,
                            -1,
                            true
                          )
                        }}</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="modal-footer" v-if="isLoading == 0">
      <button
        type="button"
        class="btn btn-success px-3"
        v-if="!isFull"
        @click.prevent="checkAll()"
      >
        <i class="fas fa-check-double"></i>
      </button>

      <button
        type="button"
        class="btn btn-warning px-3"
        @click.prevent="removeAll()"
        v-if="isFull"
      >
        <i class="far fa-times-circle"></i>
      </button>

      <button
        type="button"
        class="btn btn-warning mr-auto"
        @click.prevent="removeTransaction()"
        :disabled="removeRack.length == 0"
      >
        REMOVE TRANSACTION
        <span class="badge badge-primary">{{ removeRack.length }}</span>
      </button>

      <button
        type="button"
        class="btn btn-danger"
        @click.prevent="addTransaction()"
      >
        ADD TRANSACTION
      </button>

      <button type="button" class="btn btn-success" @click.prevent="submit">
        SUBMIT
      </button>
    </div>
  </div>
</template>

<script>
import Loader from "../../master/Loader";
import { mapGetters } from "vuex";

export default {
  components: {
    appLoader: Loader,
  },

  data() {
    return {
      isLoading: 1,
      bicOfBank: "",
      transactions: [],
      bankList: [],
      transactionsToday: [],
      removeRack: [],
    };
  },

  props: ["closeMdl", "outwardData"],

  computed: {
    isFull() {
      return this.transactions.length == this.removeRack.length;
    },

    activeBanks() {
      return this.bankList.filter((bank) => bank.active);
    },

    counter() {
      let correctCount = 0;
      const txnInstance = this.transactions.filter((txn) => !txn.sent);
      txnInstance.forEach((data) => {
        if (!this.validateObject(data)) correctCount++;
      });

      return `${correctCount}/${txnInstance.length}`;
    },

    errorCount() {
      let count = 0;

      this.transactions.forEach((data) => {
        this.validateObject(data) && count++;
      });

      return count;
    },

    duplicateCount() {
      let count = 0;

      this.transactions.forEach((data, idx) => {
        if (!data.sent)
          this.hasDuplicateBool(data.ofiReferenceNumber, idx) && count++;
      });

      return count;
    },

    sentCount() {
      let count = 0;

      this.transactions.forEach((data) => {
        data.sent && count++;
      });

      return count;
    },

    computeTotalAmount() {
      let totalAmount = 0;

      this.transactions.forEach((data) => {
        totalAmount += +data.amount.replace(/,/g, "");
      });

      return this.parseAmount(totalAmount);
    },

    ...mapGetters({
      session: "getSession",
    }),
  },

  methods: {
    parseAmount(amount) {
      const amt = `${amount}`.replace(/,/g, "");

      return (+amt).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    },

    checkRef(ref) {
      return ref.trim() ? `- ${ref}` : "";
    },

    checkAmount(amt) {
      return amt.trim() ? `- PHP ${amt}` : "";
    },

    checkAll() {
      $(".transaction-checkbox").prop("checked", true);
      this.removeRack = this.transactions
        .map((data, idx) => {
          if (!data.sent) return idx;
        })
        .filter((data) => data != undefined);
    },

    removeAll() {
      $(".transaction-checkbox").prop("checked", false);

      this.removeRack = [];
    },

    toggleCheckbox(idx) {
      $(`#checkbox-${idx}`).prop(
        "checked",
        !$(`#checkbox-${idx}`).is(":checked")
      );

      if (this.removeRack.includes(+idx))
        this.removeRack = this.removeRack.filter((rmv) => rmv != +idx);
      else this.removeRack.push(+idx);
    },

    hasDuplicateMessage(ref, idx) {
      const dupe = this.transactionsToday.filter(
        (data) => data.ofiReferenceNumber == ref
      );

      const sameTransDupe = this.transactions.filter(
        (data, key) => data.ofiReferenceNumber == ref && key != idx
      );

      return dupe.length > 0 || sameTransDupe.length > 0 ? "(DUPLICATE)" : "";
    },

    hasDuplicateBool(ref, idx) {
      const dupe = this.transactionsToday.filter(
        (data) => data.ofiReferenceNumber == ref
      );

      const sameTransDupe = this.transactions.filter(
        (data, key) => data.ofiReferenceNumber == ref && key != idx
      );

      return dupe.length > 0 || sameTransDupe.length > 0;
    },

    hasDuplicateContent(ref, idx) {
      const dupe = this.transactionsToday.filter(
        (data) => data.ofiReferenceNumber == ref
      );

      const sameTransDupe = [];

      this.transactions.forEach((data, key) => {
        if (data.ofiReferenceNumber == ref && key != idx) {
          sameTransDupe.push(key + 1);
        }
      });

      let content = "";

      if (dupe.length > 0) {
        const dupeStrings = dupe.map((data) => {
          return `Sequence Number: ${data.sequenceNumber}`;
        });

        content = dupeStrings.join("\n");
      }

      if (sameTransDupe.length > 0) {
        const sameTransDupeStrings = sameTransDupe.map((data) => {
          return `Transaction Number: ${data}`;
        });

        content =
          content.length > 0
            ? `${content}\n${sameTransDupeStrings.join("\n")}`
            : sameTransDupeStrings.join("\n");
      }

      return content;
    },

    checkBIC(bic) {
      const check = this.activeBanks.find((list) => list.BICFI == bic);

      return check ? true : false;
    },

    validateField(input, required, max, isBIC = false, isRegex = true) {
      let check = false;

      if (required && input.length == 0) check = true;
      else if (isBIC) check = !this.checkBIC(input);
      else if (max != -1 && input.length > max) check = true;
      else if (isRegex && !/^([a-zA-Z0-9\/\-\?:\(\)\.,'\+ ]*)$/.test(input))
        check = true;

      return check;
    },

    validateFieldError(input, required, max, isBIC = false, isRegex = true) {
      let error = "";

      if (required && input.length == 0) error = "This field is required.";
      else if (isBIC && !this.checkBIC(input)) error = "BIC does not exist.";
      else if (max != -1 && input.length > max)
        error = `Please enter no more than ${max} characters.`;
      else if (isRegex && !/^([a-zA-Z0-9\/\-\?:\(\)\.,'\+ ]*)$/.test(input))
        error =
          "Only alphanumeric characters, some special characters and spaces are allowed.";

      return error;
    },

    validateObjectColor(obj) {
      let color = "";

      if (obj.sent) color = "bg-success";
      else color = this.validateObject(obj) ? "bg-danger" : "bg-info";

      return color;
    },

    duplicateColor(obj) {
      return this.validateObject(obj) ? "text-white" : "text-danger";
    },

    cleanAmount(amt) {
      return amt.replace(/,/g, "");
    },

    validateObject(obj) {
      let checkRack = [];

      checkRack.push(this.validateField(obj.ofiReferenceNumber, true, 35));
      checkRack.push(
        this.validateField(this.cleanAmount(obj.amount), true, 16)
      );
      checkRack.push(this.validateField(obj.remitterName, true, 50));
      checkRack.push(this.validateField(obj.remitterAddress, true, 200));
      checkRack.push(this.validateField(obj.remitterAccountNumber, true, 35));
      checkRack.push(this.validateField(obj.beneficiaryName, true, 50));
      checkRack.push(this.validateField(obj.beneficiaryAddress, false, 200));
      checkRack.push(
        this.validateField(obj.beneficiaryAccountNumber, true, 35)
      );
      checkRack.push(this.validateField(obj.beneficiaryBIC, true, -1, true));
      checkRack.push(this.validateField(obj.rfiReferenceNumber, false, 35));
      checkRack.push(
        this.validateField(obj.ofiCustomerReferenceNumber, false, 35)
      );
      checkRack.push(
        this.validateField(obj.rfiCustomerReferenceNumber, false, 35)
      );
      checkRack.push(this.validateField(obj.instructions, true, 200));

      return checkRack.find((check) => check == true) ? true : false;
    },

    async getData() {
      this.isLoading = 1;

      const [
        { status: bankListStatus, data: bankListData },
        { status: bicStatus, data: bicData },
        { status: transStatus, data: transData },
      ] = await Promise.all([
        await this.$store.dispatch("banklist/getBankList"),
        await this.$store.dispatch("banklist/getBankBIC"),
        await this.$store.dispatch("transactionlist/getTransactionToday", {
          type: "OUTWARD",
        }),
      ]);

      this.bankList = bankListData ? bankListData.PESONetMemberBanks : [];
      this.bicOfBank = bicData || "";
      this.transactionsToday = transData || [];

      this.isLoading = 0;
      this.transactions.push(this.injectData());
      this.initDependencies();
    },

    setValue(e, key, index) {
      this.transactions[index][key] = e.target.value;
    },

    addTransaction() {
      if (this.errorCount > 0) {
        this.$popover({
          icon: "fas fa-exclamation-triangle",
          title: "Warning!",
          content: `Please fill up / fix all required fields before adding a new transaction!`,
          buttons: {
            ok: {
              text: "ok",
              btnClass: "btn-success",
              keys: ["enter"],
            },
          },
        });

        return;
      }

      this.transactions.push(this.injectData());
      let count = this.transactions.length;

      this.initDependencies();
      this.$nextTick(() => {
        $(`#collapse${count - 1}`).collapse("show");
      });
    },

    removeTransaction() {
      const vm = this;

      let forRemovalRack = [];

      this.removeRack.forEach((rmv) => {
        forRemovalRack.push(
          `<div class="col-md-12"> #${rmv + 1} ${this.checkRef(
            this.transactions[rmv].ofiReferenceNumber
          )} ${this.checkAmount(this.transactions[rmv].amount)}</div>`
        );
      });

      const content = `
      <div>
        <h3>NUMBER OF TRANSACTIONS TO BE REMOVED: <span class="text-danger">${
          this.removeRack.length
        }</span></h3>
        <h3>TRANSACTIONS:</h3>
        <div class="colored-scroll transactions-popup-content container">
          <div class="row">
            <div class="col-md-12">
              ${forRemovalRack.join("")}
            </div>
          </div>
        </div>
      </div>
      `;

      this.$popover({
        icon: "far fa-question-circle",
        title: "REMOVE TRANSACTION",
        content,
        columnClass: "col-md-8",
        onOpenBefore: function() {
          const containerSection = $(this.$content).find(
            ".transactions-popup-content"
          );
          containerSection.css({
            "max-height": "450px",
            overflow: "auto",
          });
        },
        buttons: {
          remove: {
            text: "Remove",
            btnClass: "btn-success",
            action() {
              vm.transactions = vm.transactions.filter(
                (txn, idx) => !vm.removeRack.includes(idx)
              );

              vm.removeRack = [];
              let count = vm.transactions.length;
              count == 0 && vm.transactions.push(vm.injectData());

              vm.$nextTick(() => {
                $(".transaction-checkbox").prop("checked", false);
                count == 0 && $("#collapse0").collapse("show");
              });
            },
          },
          cancel: {
            text: "Cancel",
            btnClass: "btn-danger",
          },
        },
      });
    },

    initDependencies() {
      this.$nextTick(() => {
        $(".acct-numbers").mask("#0", { reverse: true });
        $(".money").mask("#,##0.00", { reverse: true });
        $(".icon-popover").popover({
          container: "body",
          trigger: "hover",
        });
        $(".selectpicker").selectpicker();
      });
    },

    injectData() {
      return {
        ofiReferenceNumber: "",
        amount: "",
        remitterName: "",
        remitterAddress: "",
        remitterAccountNumber: "",
        remitterBIC: this.bicOfBank,
        beneficiaryName: "",
        beneficiaryAddress: "",
        beneficiaryAccountNumber: "",
        beneficiaryBIC: "",
        rfiReferenceNumber: "",
        ofiCustomerReferenceNumber: "",
        rfiCustomerReferenceNumber: "",
        instructions: "",
      };
    },

    submitTemplate(errorMessage = "") {
      let forSubmissionRack = [];

      this.transactions.forEach((txn, idx) => {
        forSubmissionRack.push(
          `<div class="col-md-12"> #${idx + 1} ${this.checkRef(
            this.transactions[idx].ofiReferenceNumber
          )} ${this.checkAmount(this.transactions[idx].amount)}</div>`
        );
      });

      return `
      <div>
        ${
          errorMessage.length > 0
            ? `<b class="text-danger">${errorMessage}</b>`
            : ""
        }
        <h3>NUMBER OF TRANSACTIONS TO BE SUBMITTED: <span class="text-success">${
          this.transactions.length
        }</span></h3>
        <h3>TRANSACTIONS:</h3>
        <div class="colored-scroll transactions-popup-content container">
          <div class="row">
            <div class="col-md-12">
              ${forSubmissionRack.join("")}
            </div>
          </div>
        </div>
      </div>
      `;
    },

    async submit() {
      const vm = this;

      if (this.errorCount > 0) {
        this.$popover({
          icon: "fas fa-exclamation-triangle",
          title: "Warning!",
          content: `Please fill up / fix all required fields before submitting the form!`,
          buttons: {
            ok: {
              text: "ok",
              btnClass: "btn-success",
              keys: ["enter"],
            },
          },
        });

        return;
      }

      const payload = {
        bicOfBank: this.bicOfBank,
        transactions: this.transactions,
      };

      this.$popover({
        icon: "far fa-question-circle",
        title: "CREATE OUTWARD MESSAGE",
        content: vm.submitTemplate(),
        columnClass: "col-md-8",
        onOpenBefore: function() {
          const containerSection = $(this.$content).find(
            ".transactions-popup-content"
          );
          containerSection.css({
            "max-height": "450px",
            overflow: "auto",
          });
        },
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
                .dispatch("outward/createOutwardMessage", payload)
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
                      : vm.submitTemplate(
                          `<b>${message}</b> <br /> ${
                            errors ? errors.join("<br />") : ""
                          }`
                        )
                  );

                  if (status == 200) {
                    vm.$emit("update:closeMdl", 1);
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

  async mounted() {
    await this.getData();
  },
};
</script>

<style scoped>
textarea {
  height: auto !important;
}

.same-line {
  display: inline-block;
}

button i {
  font-size: 20px;
}

.same-line {
  display: inline-block;
}

button i {
  font-size: 20px;
}

.accordion .custom-control-label::before {
  margin-top: -0.9rem;
  width: 2.5rem;
  height: 2.5rem;
}

.accordion .custom-control-label::after {
  margin-top: -0.9rem;
  width: 2.5rem;
  height: 2.5rem;
}
.custom-control-alternative .custom-control-label::before {
  border: 1px solid #f5365c;
}
.custom-control-alternative .custom-control-label::before {
  border: 1px solid #f5365c;
}

.custom-control-input:checked ~ .custom-control-label::before {
  border-color: #f5365c;
  background-color: #f5365c;
}

.custom-control-input:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #f5365c;
}

.custom-control-input:not(:disabled):active ~ .custom-control-label::before {
  border-color: #f5365c;
  background-color: #f5365c;
}
</style>

<style>
.popover {
  z-index: 1073 !important;
  white-space: pre-wrap;
}
</style>
