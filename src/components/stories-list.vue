<template>

      <sui-card-group :items-per-row="3" v-if="stories && stories.length" stackable>
        <sui-card v-for="story in stories" :key="story.order">
            <sui-card-content >
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
                <router-link :to="{ name: 'StoryDetail_Page', params: { id: story._id }}" class="ui bottom attached button primary">
                    <sui-icon name="add" /> Add Sequence
                </router-link>
                
                
        </sui-card>

    </sui-card-group>
    
</template>

<script>
import moment from "moment";

  export default {
    name: 'storiesList',
    props: {stories: Array},
    filters: {
        timeAgo: function (date) {
            return moment(date).fromNow();
        }
    },    
  }
</script>


<style>

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