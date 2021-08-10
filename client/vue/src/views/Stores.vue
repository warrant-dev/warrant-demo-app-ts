<template>
    <page-wrapper>
        <div class="store-list">
            <h2 class="page-title">Stores</h2>

            <section v-if="loading">
                <loader/>
            </section>

            <router-link v-else class="store" :to="{ path: `/stores/${store.id}` }" v-for="store in stores" :key="store.id">
                <h3>{{store.name}} - {{store.items.length}} Items</h3>
            </router-link>
        </div>
    </page-wrapper>
</template>

<script>
import Axios from "axios";
import { authorize, WARRANT_IGNORE_ID } from "@warrantdev/vue-warrant";
import PageWrapper from '../components/PageWrapper.vue';
import Loader from '../components/Loader.vue';

export default {
    components: {
        PageWrapper,
        Loader,
    },
    data: function() {
        return {
            stores: [],
            loading: true,
        };
    },
    async created() {
        this.loading = true;

        try {
            const response = await Axios.get("http://localhost:5000/api/stores");
            this.stores = response.data;
        } catch (e) {
            console.log("Error getting stores", e);
        }

        this.loading = false;
    },
    beforeRouteEnter: authorize({
        objectType: "store",
        objectIdParam: WARRANT_IGNORE_ID,
        relation: "viewer",
        redirectTo: "/",
    })
}
</script>

<style>
.store-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    height: 100%;
}

.store {
    min-width: 350px;

    border-radius: 5px;
    border: 1px solid gray;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

    padding: 0 15px;
}
</style>
