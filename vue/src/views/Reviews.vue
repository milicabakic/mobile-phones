<template>
    <div class="home">
        <Header/>
        <b-container>
            <b-row>
                <b-col cm="6" >
                    <ReviewList/>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import ReviewList from "@/components/ReviewList";
    import Header from "@/components/Header";

    export default {
        name: "NewMobile",
        components: {
            Header,
            ReviewList
        },

        mounted: function () {
           if (!this.$store.getters.isLoggedIn) {
                this.$router.push("/login");
       }
  }
    }
</script>

<style scoped>

</style>