<template>
  <div>
    <h1>Login</h1>
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
      <input type="button" @click="login" value="Login" />
      <p v-if="msg">{{ msg }}</p>
    <p></p>
    <p>You don't have account?</p>
    <input type="button" @click="signup" value="Register" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "login",
  mixins: [validationMixin],
  data() {
    return {
      form: {
        username: null,
        password: null,
      },
      msg: "",
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
    ...mapActions(["login_user"]),

    login: function () {
      this.$v.form.$touch();
      if(this.$v.form.$anyError) {
        this.makeToast("Error", "Oops, check your credentials.", "danger");
        return;
      }

      try {
        const credentials = JSON.stringify({
          username: this.form.username,
          password: this.form.password,
        });
        this.login_user(credentials);
      } catch (error) {
        this.msg = "Bad credentials! Please try again.";
      }
    },

    signup: function () {
      this.$router.push("/sign-up");
    },

    validateState: function(name) {
      const {$dirty, $error} = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    resetForm() {
      this.form = {
        username: null,
        password: null
      };

      this.$nextTick(() => {
        this.$v.$reset();
      });
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
