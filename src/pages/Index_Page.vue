<template lang="html">
<div>
    <stories-list :stories="stories"></stories-list>
</div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import _ from "lodash";
import StoriesList from "@/components/stories-list.vue"

export default {
    name: "Index_Page",

    data() {
        return {
            stories: [],
            errors: []
        };
    },
    components: {
        StoriesList
    },    
    // Fetches posts when the component is created.
    created() {
        axios({
                url: "http://127.0.0.1:1337/graphql",
                //url: "http://localhost:1337/graphql",
                method: "post",
                data: {
                    query: `
                    query {
                        storydefinitions {
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
                this.stories = response.data.data.storydefinitions;
                console.info(this.stories)

                axios({
                    url: "http://127.0.0.1:1337/graphql",
                    //url: "http://localhost:1337/graphql",
                    method: "post",
                    data: {
                        query: `
                        query {
                            storydefinitions {
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
                        const story = _.find(this.stories, {'_id': obj._id});
                        console.log(story)
                        console.log(obj.storyblocks)
                        Vue.set(story, 'totalBlocks', obj.storyblocks.length)
                        
                    });
    
                    console.info(this.stories)
                })
            })
            .catch(e => {
                this.errors.push(e);
            });

        // async / await version (created() becomes async created())
        //
        // try {
        //   const response = await axios.get(`http://jsonplaceholder.typicode.com/posts`)
        //   this.posts = response.data
        // } catch (e) {
        //   this.errors.push(e)
        // }
    }
};
</script>

<style>
body {
  margin: 0;
  padding: 50px;
  font: 400 14px/1.2em sans-serif; 
  background: white;
}

</style>