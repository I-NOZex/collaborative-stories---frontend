import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import Index_Page from "@/components/Index_Page";
import StoryDetail_Page from "@/components/StoryDetail_Page";
import KnockKnock_Page from "@/components/KnockKnock_Page";
import Account_Page from "@/components/Account_Page";
import store from '@/store' // your vuex store 

Vue.use(Router)
Vue.use(Vuex)

const ifNotAuthenticated = (to, from, next) => {
    if (!store.getters.isAuthenticated) {
        next()
        return
    }
    next('/')
}

const ifAuthenticated = (to, from, next) => {
    if (store.getters.isAuthenticated) {
        next()
        return
    }
    next("/knock-knock");
}

export default new Router({
    /* see: https://router.vuejs.org/guide/essentials/history-mode.html */
    mode: "history",
    routes: [
        {
            path: "/",
            name: "Index_Page",
            component: Index_Page
        },
        {
            path: "/story/:id",
            name: "StoryDetail_Page",
            component: StoryDetail_Page,
            props: true
        },
        {
            path: "/knock-knock",
            name: "KnockKnock_Page",
            component: KnockKnock_Page,
            props: true,
            beforeEnter: ifNotAuthenticated
        },
        {
            path: "/its-a-me/:id",
            name: "Account_Page",
            component: Account_Page,
            props: true,
            beforeEnter: ifAuthenticated
        }
    ]
});
