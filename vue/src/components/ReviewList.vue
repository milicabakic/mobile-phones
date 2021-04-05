<template>
  <div>
    <b-container>
      <b-form>
        <b-row class="mt-2">
          <b-col sm="6" offset="2" class="mx-auto">
            <b-input
              v-model="$v.form.id.$model"
              class="mb-2 mr-sm-2 mb-sm-0 input"
              placeholder="Enter a ID of mobile phone"
              :state="validateState('id')"
            ></b-input>
            <b-form-invalid-feedback id="input-2-feedback">
              You must enter an ID.
             </b-form-invalid-feedback>
            <b-button variant="primary" size="lg" @click="search">Search reviews</b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>
    <b-table
      sticky-header="800px"
      :items="reviews"
      head-variant="light"
      @row-clicked="editReview"
    ></b-table>
    <b-form>
      <b-row class="mt-2">
        <b-col lg="6" offset="2" class="text-center mx-auto">
          <!-- <b-input
            v-model="user"
            class="mb-2 mr-sm-2 mb-sm-0 mb-2 input"
            placeholder="Unesite ime"
          ></b-input> -->
          <b-input
            v-model="$v.form.ocena.$model"
            class="mb-2 mr-sm-2 mb-sm-0 mb-2 input"
            placeholder="Write your mark for this mobile phone."
            :state="validateState('ocena')"
          ></b-input>
          <b-button variant="primary" size="lg" @click="addNew">Save</b-button>
        </b-col>
      </b-row>
    </b-form>
      
  </div>
</template>

<script>

import router from "@/router";
import { mapState, mapActions } from 'vuex';
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  name: "CommentsList",
  mixins: [validationMixin],
  computed: {
            ...mapState(['reviews'])
        },

  data() {
    return {
      form: {
        id: null,
        ocena: null,
      },
      user: '',
    };
  },
  validations: {
    form: {
      id: {
        required
      },
      ocena: {
        required,
        maxLength: maxLength(2)
      },
    },
  },
  methods: {
     ...mapActions(['load_reviews', 'new_review']),

    search: function () {
      this.load_reviews(this.form.id);
    },

    addNew: function () {
      this.$v.form.$touch();
      if(this.$v.form.$anyError) {
        this.makeToast("Error", "Oops, please try again.", "danger");
        return;
      }

       const review = JSON.stringify({idTelefona: this.form.id, user_id: this.$store.state.user,user: this.$store.state.username, ocena: parseInt(this.form.ocena) });
       this.new_review(review);
    },

    editReview: function (item, index, event) {
      if(item.user_id === this.$store.state.user){
        router.push({path: `/review/${item.id}`});
      }
    },

    validateState: function(name) {
      const {$dirty, $error} = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    makeToast(title, text, variant, append = false) {
      this.$bvToast.toast(text, {
        title,
        autoHideDelay: 5000,
        variant,
        appendToast: append
      });
    }

  },
};
</script>

<style scoped>
.input {
  margin-bottom: 10px !important;
}
</style>