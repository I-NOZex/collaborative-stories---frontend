// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import SuiVue from "semantic-ui-vue";
import vSelect from "vue-select";
Vue.component("v-select", vSelect);

Vue.config.productionTip = false;
Vue.use(SuiVue);
/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    components: { App },
    template: "<App/>"
});