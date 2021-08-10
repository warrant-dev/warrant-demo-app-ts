<template>
    <page-wrapper>
        <section v-if="loading">
            <loader/>
        </section>

        <section v-else>
            <h2 class="item-title">{{ item.name }}</h2>
            <p class="item-description">{{ item.description }}</p>
        </section>
    </page-wrapper>
</template>

<script>
import Axios from "axios";
import { authorize } from "@warrantdev/vue-warrant";

import Loader from '../components/Loader.vue';
import PageWrapper from '../components/PageWrapper.vue';

export default {
    components: {
        PageWrapper,
        Loader,
    },
    data: function() {
        return {
            item: null,
            loading: true,
        };
    },
    async created() {
        this.loading = true;

        try {
            const response = await Axios.get(`http://localhost:5000/api/stores/${this.$route.params.storeId}/items/${this.$route.params.itemId}`);
            this.item = response.data;
        } catch (e) {
            console.log("Error getting item", e);
        }

        this.loading = false;
    },
    beforeRouteEnter: authorize({
        objectType: "item",
        objectIdParam: "itemId",
        relation: "viewer",
        redirectTo: "/",
    })
};
</script>

<style>
.item-title {
    text-align: center;
}

.item-description {
    text-align: center;
}
</style>
