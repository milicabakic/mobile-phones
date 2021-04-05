<template>
  <div>
    <h1>Sign Up</h1>
    <b-form-input id="input-1" name="input-1" v-model="$v.form.username.$model" :state="validateState('username')"> 
    </b-form-input>
    <b-form-invalid-feedback id="input-1-feedback">
      Username must contains at least 4 characters.
    </b-form-invalid-feedback>    
    <p></p>
    <b-form-input type="password" id="input-2" name="input-2" v-model="$v.form.password.$model" :state="validateState('password')">
    </b-form-input>
    <b-form-invalid-feedback id="input-2-feedback">
      Password must contains at least 3 characters.
    </b-form-invalid-feedback>   
    <p></p>
    <input type="button" @click="signUp" value="Sign Up" />
    <p v-if="msg">{{ msg }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "signUp",
  mixins: [validationMixin],
  data() {
    return {
      form: {
       username: null,
       password: null,
      },
      msg: ''
    };
  },
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(4),
      },
      password: {
        required,
        minLength: minLength(3)
      },
    },
  },  

  methods: {
    ...mapActions(['signup_user']),

    signUp: function() {
      this.$v.form.$touch();
      if(this.$v.form.$anyError) {
        this.makeToast("Error", "Oops, check your credentials.", "danger");
        return;
      }

       try {
        const credentials =  JSON.stringify({
          username: this.form.username,
          password: this.form.password
        });
        this.signup_user(credentials);
        this.$router.push('/');
      } catch (error) {
        this.msg = "Please try again.";
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

  }

};
</script>