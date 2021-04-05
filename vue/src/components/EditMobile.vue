<template>
  <b-container fluid>
    <b-form>
      <b-row class="mt-2">
        <b-col sm="4" offset="2">
          <b-input
            v-model="$v.form.newBrand.$model"
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Enter a brand"
            :state="validateState('newBrand')"
          ></b-input>
          <b-form-invalid-feedback id="input-1-feedback">
              You must enter a brand with max length 20.
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col sm="4" offset="2">
          <b-input
            v-model="$v.form.newModel.$model"
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Enter a model"
            :state="validateState('newModel')"
          ></b-input>
          <b-form-invalid-feedback id="input-2-feedback">
              You must enter a model with min length 2 and max length 20.
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col sm="4" offset="2">
          <b-input
            v-model="$v.form.newMemory.$model"
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Enter a memory"
            :state="validateState('newMemory')"
          ></b-input>
          <b-form-invalid-feedback id="input-3-feedback">
              You must enter a memory with min length 3.
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col sm="4" offset="2">
          <b-input
            v-model="$v.form.newColor.$model"
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Enter a colour"
            :state="validateState('newColor')"
          ></b-input>
          <b-form-invalid-feedback id="input-2-feedback">
              You must enter a colour with max length 15.
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col sm="4" offset="2">
          <b-input
            v-model="$v.form.newPrice.$model"
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Enter a price"
            :state="validateState('newPrice')"
          ></b-input>
          <b-form-invalid-feedback id="input-2-feedback">
              You must enter a price. 
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col sm="8">
          <b-button variant="primary" size="lg" @click="addNew">Save</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, maxLength, minLength } from "vuelidate/lib/validators";

export default {
  name: "EditMobile",
  mixins: [validationMixin],
  props: {
    marka: {
      type: String,
      default: "",
    },
    model: {
      type: String,
      default: "",
    },
    memorija: {
      type: String,
      default: "",
    },
    boja: {
      type: String,
      default: "",
    },
    cena: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        newBrand: null,
        newModel: null,
        newMemory: null,
        newColor: null,
        newPrice: null,
        id: null,
      },
    };
  },
  validations: {
    form: {
      newBrand: {
        required,
        maxLength: maxLength(20),
      },
      newModel: {
        required,
        maxLength: maxLength(20),
        minLength: minLength(1)
      },
      newMemory: {
        required,
        minLength: minLength(3),
      },
      newColor: {
        required,
        maxLength: maxLength(15),
      },
      newPrice: {
        required
      },
    },
  },

  mounted: function () {
    this.form.newBrand = this.marka;
    this.form.newModel = this.model;
    this.form.newMemory = this.memorija;
    this.form.newColor = this.boja;
    this.form.newPrice = this.cena;
  },
  methods: {
    ...mapActions(["new_mobile", "change_mobile"]),

    addNew: function () {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        this.makeToast("Error", "Oops, please try again.", "danger");
        return;
      }

      const mob = JSON.stringify({
        marka: this.form.newBrand,
        model: this.form.newModel,
        memorija: this.form.newMemory,
        boja: this.form.newColor,
        cena: parseInt(this.form.newPrice),
      });

      if (!this.$route.params.id) this.new_mobile(mob);
      else {
        this.change_mobile({ id: this.$route.params.id, mob: mob });
      }
      this.form.newModel = "";
      this.form.newBrand = "";
      this.form.newColor = "";
      this.form.newMemory = "";
      this.form.newPrice = 0;
    },

    validateState: function (name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    makeToast(title, text, variant, append = false) {
      this.$bvToast.toast(text, {
        title,
        autoHideDelay: 5000,
        variant,
        appendToast: append,
      });
    },
  },
};
</script>

<style scoped>
</style>