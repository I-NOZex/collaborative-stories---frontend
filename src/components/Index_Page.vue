<template lang="html">
<div>
    <sui-card-group :items-per-row="3" v-if="stories && stories.length" stackable>
        <sui-card v-for="(story, idx) in stories" :key="idx">
            <sui-card-content>
                <sui-image src="https://api.adorable.io/avatars/40/boot.png" shape="circular" size="mini" />
                <strong>{{story.user ? story.user.username : "..."}}</strong>
                <sui-card-meta slot="right">{{story.createdAt | timeAgo}}</sui-card-meta>
            </sui-card-content>

            <sui-card-content>
                <sui-card-description>
                    <p class="block-with-text">
                    {{story.storyblocks.length ? story.storyblocks[0].storyBody : '...'}}
                    </p>
                </sui-card-description>
            </sui-card-content>
            <sui-card-content>
                <span slot="right">
                    <sui-icon name="heart outline" /> {{story.likes||0}} {{story.likes == 1 ? 'like' : 'likes'}}
                </span>
                <sui-icon name="comment" /> {{story.totalBlocks||0}} {{story.totalBlocks == 1 ? 'sequence' : 'sequences'}}
            </sui-card-content>
                <router-link :to="{ name: 'StoryDetail_Page', params: { id: story._id }}" class="ui bottom attached button">
                    <sui-icon name="add" /> Add Sequence
                </router-link>
                
                
        </sui-card>

    </sui-card-group>
</div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import moment from "moment";
import _ from "lodash";

export default {
    name: "Index_Page",

    data() {
        return {
            stories: [],
            errors: []
        };
    },

    filters: {
        timeAgo: function (date) {
            return moment(date).fromNow();
        }
    },

    // Fetches posts when the component is created.
    created() {
        axios({
                url: "http://192.168.0.40:1337/graphql",
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
                    url: "http://192.168.0.40:1337/graphql",
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

/* styles for '...' */ 
.block-with-text {
  /* hide text if it more than N lines  */
  overflow: hidden;
  /* for set '...' in absolute position */
  position: relative; 
  /* use this value to count block height */
  line-height: 1.4285em; /* SEMANTIC-UI default */
  /* max-height = line-height (1.4285em) * lines max number (3) */
  max-height: calc(1.4285em * 3); 
  /* fix problem when last visible word doesn't adjoin right side  */
  text-align: justify;
  
  /* */
  margin-right: -1em;
  padding-right: 1em;
}
.block-with-text:before {
  /* points in the end */
  content: '...';
  /* absolute position */
  position: absolute;
  /* set position to right bottom corner of block */
  right: 0;
  bottom: 0;
}
.block-with-text:after {
  /* points in the end */
  content: '';
  /* absolute position */
  position: absolute;
  /* set position to right bottom corner of text */
  right: 0;
  width: 1em;
  /* set width and height */
  height: 1em;
  margin-top: 0.2em;
  background: white;
}
</style>