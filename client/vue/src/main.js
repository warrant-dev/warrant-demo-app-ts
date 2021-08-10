import Vue from "vue";
import router from "./router";
import App from "./App.vue";
import { Warrant } from "@warrantdev/vue-warrant";

Vue.config.productionTip = false;

Vue.use(Warrant, {
    clientKey: "<replace_with_your_client_key>",
});

new Vue({
    router,
    // store,
    render: h => h(App)
}).$mount("#app");
