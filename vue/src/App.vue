<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/edit">New Mobile</router-link> |
      <router-link to="/reviews">Reviews</router-link> |
      <input type="button" @click="logoutUser" value="Logout"/>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "App",
  methods: {
    ...mapActions(["load_mobiles", "logout"]),

    logoutUser: function () {
      this.logout();
      this.$router.push("/login");
    },
  },

  mounted: function () {
    console.log('mounted');
    this.load_mobiles();
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
