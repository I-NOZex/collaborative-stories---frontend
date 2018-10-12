// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "semantic-ui-css/semantic.min.css";
import Vue from "vue";
import App from "./App";
import router from "./router";
import SuiVue from "semantic-ui-vue";
import vSelect from "vue-select";
import store from "./store";
import axios from "axios";

Vue.component("v-select", vSelect);

Vue.config.productionTip = false;
Vue.use(SuiVue);

const token = localStorage.getItem('user-token')
if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store,
    components: { App },
    template: "<App/>"
});
