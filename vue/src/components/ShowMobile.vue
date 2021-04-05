<template>

    <b-container fluid>
        <b-row>
            <b-col sm="2">
                <label for="id">ID:</label>
            </b-col>
            <b-col sm="10">
                <p id="id" style="text-align: left">{{ mobile.id }}</p>
            </b-col>
        </b-row>

        <b-row class="mt-2">
            <b-col sm="2">
                <label for="marka">Marka:</label>
            </b-col>
            <b-col sm="10">
                <p id="marka" style="text-align: left">{{ mobile.marka }}</p>
            </b-col>
        </b-row>

         <b-row>
            <b-col sm="2">
                <label for="model">Model:</label>
            </b-col>
            <b-col sm="10">
                <p id="model" style="text-align: left">{{ mobile.model }}</p>
            </b-col>
        </b-row>

         <b-row>
            <b-col sm="2">
                <label for="memorija">Memorija:</label>
            </b-col>
            <b-col sm="10">
                <p id="memorija" style="text-align: left">{{ mobile.memorija }}</p>
            </b-col>
        </b-row>

        <b-row class="mt-2">
            <b-col sm="2">
                <label for="boja">Boja:</label>
            </b-col>
            <b-col sm="10">
                <p id="boja" style="text-align: left">{{ mobile.boja }}</p>
            </b-col>
        </b-row>

        <b-row class="mt-2">
            <b-col sm="2">
                <label for="cena">Cena:</label>
            </b-col>
            <b-col sm="10">
                <p id="cena" style="text-align: left">{{ mobile.cena }}</p>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    export default {
        name: "ShowMobile",
        props: {
            mobile: Object
        }
    }
</script>