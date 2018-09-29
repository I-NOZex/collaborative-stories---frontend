import Vue from 'vue'
import Router from 'vue-router'
import GridList from "@/components/GridList";
import StoryDetail from "@/components/StoryDetail";

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: "/",
            name: "GridList",
            component: GridList
        },
        {
            path: "/story/:id",
            name: "StoryDetail",
            component: StoryDetail,
            props: true
        }
    ]
});
