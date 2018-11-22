<template>
<sui-card>
    <sui-card-content>
        <sui-image
            src="https://api.adorable.io/avatars/40/boot.png"
            shape="circular"
            size="mini"
        />
        <strong>{{story.user ? story.user.username : "..."}}</strong>
        <sui-card-meta slot="right" :title="story.createdAt">{{story.createdAt | timeAgo}}</sui-card-meta>
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
            <span v-if="user.isAuthenticated">
                <div
                    class="ui animated fade button medium basic link"
                    tabindex="0"
                    v-on:mousedown.prevent="$event.preventDefault()"
                >
                    <div
                        class="content visible"
                    >
                        <sui-icon
                            name="heart"  
                            v-bind:class="{outline: !isLiked, red: isLiked}"                          
                        /> 
                        {{story.likes.length||0}} {{story.likes.length == 1 ? 'like' : 'likes'}}
                    </div>

                    <div
                        class="content hidden"
                        v-if="isLiked"
                        @click="requestRemoveLike(story)"
                    >
                        <sui-icon
                            name="heart outline"
                        />                                     
                        Remove Like
                    </div>

                    <div
                        class="content hidden"
                        v-if="!isLiked"
                        @click="requestLike(story)"
                    >
                        <sui-icon
                            name="heart"
                            color="red"
                        />                                     
                        Add Like
                    </div>                            
                </div>

            </span>

            <span v-else>
                <sui-icon
                    name="heart"
                    v-bind:class="{red: isLiked, outline:!isLiked}"
                /> 
                {{story.likes.length||0}} {{story.likes.length == 1 ? 'like' : 'likes'}}
            </span>
        </span>
        <router-link
            :to="{ name: 'StoryDetail_Page', params: { id: story._id }, hash: '#add-sequence'}"
        >
            <sui-icon name="comment" color="blue" /> {{story.totalBlocks||0}} {{story.totalBlocks == 1 ? 'sequence' : 'sequences'}}
        </router-link>
    </sui-card-content>
    <router-link
        :to="{ name: 'StoryDetail_Page', params: { id: story._id }}"
        class="ui bottom attached button primary"
    >
        <sui-icon name="add" /> Add Sequence
    </router-link>

</sui-card>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import _ from "lodash";
import Stories from "@/services/api/Stories";

export default {
    name: 'storiesList',
    props: {
        story: Object
    },
    data() {
        return {
            likeLoading: false

        }
    },
    computed: {
        user() {
            return this.$store.getters
        },
        isLiked() {
            return this.isCurrentUserLiked(this.story.likes);
        }
    },
    filters: {
        timeAgo: function (date) {
            return moment(date).fromNow();
        },
    },
    mounted() {
        // this.stories = _.forEach(this.stories, story => { 
        //     if( this.isCurrentUserLiked(story.likes) )
        //         Vue.set(story, 'liked', true)
        //  });
        //  console.log(this.stories)
    },
    methods: {
        isCurrentUserLiked(likes) {
            if (!this.user.isAuthenticated) return false;
            if (!likes || likes.length < 1) return false;
            const currUserID = this.user.getProfile._id;

            return !!_.find(likes, like => {
                return like._id === currUserID
            })
        },

        requestLike(story) {
            let storyLikes = story.likes;
            const currUserID = this.user.getProfile._id;
            storyLikes.push(currUserID);

            Stories.updateStoryDefinitionLikes(story._id, {
                likes: storyLikes
            })
            .then(response => {
                console.log('success')
                Vue.set(this.story, 'likes', response.data.likes)
            })
            .catch(e => {
                this.errors.push(e);
            });
        },

        requestRemoveLike(story) {
            const currUserID = this.user.getProfile._id;
            const storyLikes = _.filter(story.likes, like => {
                return like._id !== currUserID
            })

            Stories.updateStoryDefinitionLikes(story._id, {
                likes: storyLikes
            })
            .then(response => {
                console.log('success')
                Vue.set(this.story, 'likes', response.data.likes)

            })
            .catch(e => {
                this.errors.push(e);
            });
        }
    }
}
</script>

<style>
.ui.basic.button.link {
    border: 0 none;
    box-shadow: none;
    padding: 2px 0;
}

/* styles for '...' */
.block-with-text {
    /* hide text if it more than N lines  */
    overflow: hidden;
    /* for set '...' in absolute position */
    position: relative;
    /* use this value to count block height */
    line-height: 1.4285em;
    /* SEMANTIC-UI default */
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
