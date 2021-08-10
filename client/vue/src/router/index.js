import Vue from "vue";
import VueRouter from "vue-router";

import EditStore from "../views/EditStore.vue";
import Item from "../views/Item.vue";
import Login from "../views/Login.vue";
import Store from "../views/Store.vue";
import Stores from "../views/Stores.vue";

Vue.use(VueRouter);

export default new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            redirect: "/login",
        },
        {
            path: "/login",
            component: Login,
        },
        {
            path: "/stores/:storeId/items/:itemId",
            component: Item,
        },
        {
            path: "/stores/:storeId/edit",
            component: EditStore,
        },
        {
            path: "/stores/:storeId",
            component: Store,
        },
        {
            path: "/stores",
            component: Stores,
        },
    ]
});
