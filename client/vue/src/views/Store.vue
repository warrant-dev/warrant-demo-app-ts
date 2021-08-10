<template>
    <page-wrapper>
        <section v-if="loading">
            <loader/>
        </section>

        <section v-else>
            <h2 class="page-title">{{ store.name }}</h2>

            <protected-view :objectType="'store'" :objectId="$route.params.storeId" :relation="'editor'">
                <router-link :to="{ path: `/stores/${store.id}/edit` }" class="edit-button">Edit Store</router-link>
            </protected-view>

            <div class="item-list">
                <div class="item" v-for="item in store.items" :key="item.id">
                    <router-link :to="{ path: `/stores/${store.id}/items/${item.id}` }">
                        <h3>{{ item.name }} - ${{ item.price }}</h3>
                    </router-link>
                    <p>{{ item.description }}</p>
                </div>
            </div>
        </section>
    </page-wrapper>
</template>

<script>
import Axios from "axios";
import { ProtectedView, authorize } from "@warrantdev/vue-warrant";

import Loader from "../components/Loader.vue";
import PageWrapper from "../components/PageWrapper.vue";

export default {
    components: {
        Loader,
        PageWrapper,
        ProtectedView,
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
    beforeRouteEnter: authorize({
        objectType: "store",
        objectIdParam: "storeId",
        relation: "viewer",
        redirectTo: "/",
    })
}
</script>

<style>
.edit-button {
    text-decoration: none;
    color: black;
    border: 1px solid gray;
    border-radius: 5px;
    padding: 5px;
    display: block;
    margin: 10px auto;
    width: 72px;
}

.item-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    height: 100%;
}

.item {
    min-width: 275px;
    max-width: 350px;

    border-radius: 5px;
    border: 1px solid gray;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

    padding: 0 15px;
}
</style>
