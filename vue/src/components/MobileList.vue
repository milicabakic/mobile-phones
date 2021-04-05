<template>
    <div>
        <b-table
                hover v-if="mobiles.length"
                sticky-header="800px"
                :items="mobiles"
                :fields="fields"
                head-variant="light"
                @row-clicked="editMobile">
            <template v-slot:cell(action)="row">
                <b-button variant="danger" @click="delete_mobile(row.item.id)">Delete</b-button>
            </template>
        </b-table>
    </div>
</template>

<script>
    import router from "@/router";
    import { mapState, mapActions } from 'vuex';

    export default {
        name: "MobileList",
        computed: {
            ...mapState(['mobiles'])
        },
        data() {
            return {
                fields: [
                    { key: 'id' },
                    { key: 'marka' },
                    { key: 'model' },
                    { key: 'memorija' },
                    { key: 'boja' },
                    { key: 'cena' },
                    { key: 'action' }
                ]
            }
        },
        methods: {
            ...mapActions(['delete_mobile']),

            editMobile: function (item, index, event) {
                router.push({path: `/mobile/${item.id}`})
            }
        }
    }
</script>

<style>
    tr:hover td{
        background: lightgreen;
    }
</style>