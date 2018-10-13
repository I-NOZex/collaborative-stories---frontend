<template lang="html">
<div>
    <sui-segment>
        <sui-header icon text-align="center">
            <sui-icon name="users" circular />
            <sui-header-content>
                <h2>{{profile.username}}</h2>
                <span>{{profile.email}}</span>
            </sui-header-content>
        </sui-header>
        <sui-divider />

        <sui-menu secondary>
            <a
            is="sui-menu-item"
            v-for="item in menu.items"
            :active="isActive(item)"
            :key="item"
            :content="item"
            @click="select(item)"
            />
            <sui-menu-menu position="right">
                <a
                is="sui-menu-item"
                :active="isActive('Settings')"
                content="Settings"
                @click="select('Settings')"
                />
            </sui-menu-menu>
        </sui-menu>    
    </sui-segment>

    <!-- ======= GRID ========== -->
        <stories-list :stories="myStories"></stories-list>

</div>
</template>

<script>
import StoriesList from "@/components/stories-list.vue"
import axios from "axios";


export default {
    name: "Account_Page",
    components: {
        StoriesList
    },
    data() {
        return {
            profile: this.$store.getters.getProfile,
            menu: {
                active: 'My Stories',
                items: ['My Stories', 'My Sequences', 'Likes'],
            },
            myStories: []
        }
    },
    methods: {
        isActive(name) {
            return this.menu.active === name;
        },
        select(name) {
            this.menu.active = name;
        },
    },    
    created(){
       axios({
                url: "http://127.0.0.1:1337/graphql",
                //url: "http://localhost:1337/graphql",
                method: "post",
                data: {
                    query: `
                    query {
                        storydefinitions(where: {user:"` + this.profile._id + `"})  {
                            _id
                            title
                            createdAt
                            likes
                            user {
                                username
                            }
                            # FIXME: I should be able to use 'where: {order: 1}' as a filter
                            storyblocks (sort: "order:asc", limit: 1) {
                                storyBody
                                order
                                _id
                            }
                        }
                    }
                `
                }
            })
            .then(response => {
                // JSON responses are automatically parsed.
                this.myStories = response.data.data.storydefinitions;
                console.info(this.myStories)

                axios({
                    url: "http://127.0.0.1:1337/graphql",
                    //url: "http://localhost:1337/graphql",
                    method: "post",
                    data: {
                        query: `
                        query {
                            storydefinitions(where: {user:"` + this.profile._id + `"}) {
                                _id
                                storyblocks {
                                    _id
                                }
                            }
                        }
                    `
                    }
                })
                .then(storyblocksCount => {
                    console.clear();
                    //sum each storydefinition sequences
                    const blocks = _.forEach(storyblocksCount.data.data.storydefinitions, obj => {
                        const story = _.find(this.myStories, {'_id': obj._id});
                        console.log(story)
                        console.log(obj.storyblocks)
                        Vue.set(story, 'totalBlocks', obj.storyblocks.length)
                        
                    });
    
                })
            })
            .catch(e => {
                this.errors.push(e);
            });

              
    }
}
</script>

<style scoped>
.ui.secondary.pointing.menu {
    margin-bottom: -1em;
    position: relative;
    border-color: transparent;
}
</style>
