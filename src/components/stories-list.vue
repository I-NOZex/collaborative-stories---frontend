<template>
    <sui-card-group
        :items-per-row="3"
        v-if="stories && stories.length"
        stackable
    >
        <story-list-item
            v-for="story in stories"
            :key="story.order"
            :story="story"
        >
        </story-list-item>

    </sui-card-group>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import _ from "lodash";
import Stories from "@/services/api/Stories";
import StoryListItem from "@/components/story-list-item.vue";


export default {
    name: 'storiesList',
    props: {
        stories: Array
    },
    components: {
        StoryListItem
    },   
    data(){
        return {
            likeLoading: false

        }
    },
    mounted(){
        // this.stories = _.forEach(this.stories, story => { 
        //     if( this.isCurrentUserLiked(story.likes) )
        //         Vue.set(story, 'liked', true)
        //  });
        //  console.log(this.stories)
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
