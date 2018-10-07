import Vue from 'vue'
import Router from 'vue-router'
import Index_Page from "@/components/Index_Page";
import StoryDetail_Page from "@/components/StoryDetail_Page";
import KnockKnock_Page from "@/components/KnockKnock_Page";

Vue.use(Router)

export default new Router({
    // https://router.vuejs.org/guide/essentials/history-mode.html
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
            props: true
        }
    ]
});
