<template>
    <page-wrapper>
        <h2 class="page-title">Edit Store</h2>

        <section v-if="loading">
            <loader/>
        </section>

        <form v-else @submit.prevent="saveStore()" class="edit-form">
            <input
                id="name"
                type="text"
                placeholder="Name"
                class="name-input"
                required
                v-model="store.name"
            />
            <button type="submit" class="save-button">Save</button>
        </form>
    </page-wrapper>
</template>

<script>
import Axios from "axios";
import { authorize } from "@warrantdev/vue-warrant";

import Loader from '../components/Loader.vue';
import PageWrapper from '../components/PageWrapper.vue';

export default {
    components: {
        Loader,
        PageWrapper
    },
    data: function() {
        return {
            store: null,
            loading: true,
        };
    },
    async created() {
        this.loading = true;

        try {
            const response = await Axios.get(`http://localhost:5000/api/stores/${this.$route.params.storeId}`);
            this.store = response.data;
        } catch (e) {
            console.log("Error getting store", e);
        }

        this.loading = false;
    },
    methods: {
        async saveStore() {
            try {
                await Axios.post(`http://localhost:5000/api/stores/${this.$route.params.storeId}`, {
                    name: this.store.name,
                });

                this.$router.push({ path: "/stores" });
            } catch (e) {
                console.log("Error while updating store", e);
            }
        }
    },
    beforeRouteEnter: authorize({
        objectType: "store",
        objectIdParam: "storeId",
        relation: "editor",
        redirectTo: "/",
    })
}
</script>

<style>
.edit-form {
    max-width: 350px;
    margin: auto;
    height: 100%;
}

.name-input {
    width: 250px;
    padding: 0;
    padding-left: 5px;
}

.save-button {
    width: 55px;
    margin-left: 5px;
}
</style>
