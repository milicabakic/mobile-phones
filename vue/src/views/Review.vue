<template>
  <b-container fluid>
    <b-form>
      <b-row class="mt-2">
        <b-col sm="4" offset="2">
          <b-input
            v-model="$v.form.ocena.$model"
            class="mb-2 mr-sm-2 mb-sm-0 mb-2 input"
            placeholder="Write your mark for this mobile phone."
            :state="validateState('ocena')"
          ></b-input>
        </b-col>
      </b-row>
    </b-form>

    <b-row class="mt-2">
      <b-col sm="8">
        <b-button variant="primary" size="lg" @click="saveChange"
          >Save</b-button
        >
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Header from "@/components/Header";
import { mapState, mapActions } from "vuex";
import router from "@/router";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  name: "Review",
  mixins: [validationMixin],
  components: {
    Header,
  },
  props: {
    review: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        ocena: null
      },
    };
  },
  validations: {
    form: {
      ocena: {
        required,
        maxLength: maxLength(2)
      },
    },
  },

  methods: {
    ...mapActions(["change_review"]),

    saveChange: function () {
      this.$v.form.$touch();
      if(this.$v.form.$anyError) {
        this.makeToast("Error", "Oops, please try again.", "danger");
        return;
      }
      
      
      let review = {};

      for (let i = 0; i < this.$store.state.reviews.length; i++)
        if (this.$store.state.reviews[i].id === parseInt(this.$route.params.id))
          review = this.$store.state.reviews[i];

      const ocena = JSON.stringify({ ocena: this.form.ocena });
      this.change_review({
        id: review.id,
        idTelefona: review.idTelefona_id,
        user_id: review.user_id,
        ocena: ocena,
      });

      router.push({ path: `/reviews` });
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
</style>