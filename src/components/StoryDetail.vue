<template lang="html">
<div>
    <sui-grid stackable>
        <sui-grid-row>

            <sui-grid-column :width="8">
                <sui-segment stacked="tall">
                    <div class="ui fluid image">
                        <sui-image shape="rounded" src="https://semantic-ui-vue.github.io/static/images/avatar/large/daniel.jpg" />
                        <div class="ui ribbon label translucid massive mobile hide">
                            {{story.title}}
                        </div>

                        <div class="ui ribbon label translucid medium computer hide">
                            {{story.title}}
                        </div>

                        <sui-label attached="bottom right" image color="teal">
                            <small>A story started by:</small>
                            {{story.user ? story.user.username : '...'}}
                            <sui-label-detail>{{story.createdAt | timeAgo}}</sui-label-detail>
                        </sui-label>
                    </div>
                </sui-segment>
            </sui-grid-column>

            <sui-grid-column :width="8">
                <sui-segment stacked="tall">
                    <p>
                      {{storyBlocks | firstStoryText}}
                    </p>
                </sui-segment>
            </sui-grid-column>
            
        </sui-grid-row>
        <sui-grid-row>
            <sui-grid-column :width="8">
                <sui-button basic color="red" content="Like" icon="heart" size="mini">
                    <a
                        is="sui-label"
                        slot="label"
                        basic
                        color="red"
                        pointing="left"
                    >
                        {{story.likes || 0}}
                    </a>
                </sui-button>

                <sui-button basic color="blue" content="Share" icon="facebook" size="mini">
                    <a
                        is="sui-label"
                        slot="label"
                        basic
                        color="blue"
                        pointing="left"
                    >
                        1,048
                    </a>
                </sui-button>
            </sui-grid-column :width="8">
        </sui-grid-row>
    </sui-grid>

    
    <sui-comment-group class="container fluid">
        <h3 is="sui-header" dividing>Sequences</h3>

        <sui-comment v-for="(storyBlock, idx) in storyBlocks" :key="idx" v-if="storyBlock.order > 0">
                <sui-comment-avatar src="https://semantic-ui-vue.github.io/static/images/avatar/small/jenny.jpg" />
                <sui-comment-content>
                    <a is="sui-comment-author">{{storyBlock.user ? storyBlock.user.username : '...'}}</a>
                    <sui-comment-metadata>
                        <div>{{storyBlock.createdAt | timeAgo}}</div>
                    </sui-comment-metadata>
                    <sui-comment-text>
                        <sui-segment stacked="tall">
                            {{storyBlock.storyBody}}
                        </sui-segment>
                    </sui-comment-text>

                    <!-- <sui-comment-actions>
                        <sui-comment-action>
                            <sui-icon name="heart" color="red"/> You and 1234 others like this
                        </sui-comment-action>
                        <sui-comment-action>
                            <sui-icon name="facebook outline" /> Share
                        </sui-comment-action>
                    </sui-comment-actions> -->
            </sui-comment-content>
            <sui-divider hidden/>
        </sui-comment>

        <form class="ui reply form">
            <sui-comment>
                <sui-comment-avatar src="https://semantic-ui-vue.github.io/static/images/avatar/small/jenny.jpg" />
                    <sui-comment-content>
                        <a is="sui-comment-author">{{'Username'}}</a>
                        <sui-comment-text>
                            <sui-segment stacked="tall">
                                <textarea placeholder="Let your imagination run wild..."></textarea>
                                <div is="sui-button" attached="bottom" content="Add Reply" icon="edit" primary v-click="newSequence" />
                            </sui-segment>
                        </sui-comment-text>
                        <sui-divider hidden/>
                    </sui-comment-content>
                </sui-comment>
        </form>

    </sui-comment-group>
   
</div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import moment from "moment";
import VueAlertify from "vue-alertify"
Vue.use(VueAlertify)

export default {
    name: "StoryDetail",

    data() {
        return {
            story: {},
            storyBlocks: {},
            errors: []
        };
    },

    filters: {
        timeAgo: function (date) {
            return moment(date).fromNow();
        },
        firstStoryText: function(arr){
            if(!Array.isArray(arr)) return [];
            if(arr.length < 1) return [];
            return arr[0].storyBody;
        }
    },

    methods : {

        buildLookupTable: function(text) {
            text = text.toLowerCase();
            var LUT = {minLen: 1, maxLen: 0};
            var rxWord = /\w+/gm;
            for (var match; match = rxWord.exec(text); ) {
                var word = match[0];
                var wordLen = word.length;
                if (wordLen > LUT.maxLen)
                    LUT.maxLen = wordLen;

                var fringeHub = LUT[wordLen];
                if (!fringeHub)
                    fringeHub = LUT[wordLen] = {};

                var fringe = word[0] + word.slice(-1);
                var words = fringeHub[fringe];
                if (!words)
                    words = fringeHub[fringe] = new Set();
                words.add(word);
            }

            // Fix the dictionary a bit: remove all 1-letter nonwords (except I and A)
            LUT[1] = LUT[1] ? {aa: LUT[1].aa, ii: LUT[1].ii} : undefined;
            return LUT;
        },
        

        newSequence: function(){

            axios.get(`https://raw.githubusercontent.com/Icepickle/wordlist/master/words2.txt`)
            .then(buildLookupTable)
            .then(lut => {
                console.log(lut)
            });
/* 
            try {
                const response = axios({
                    url: "http://192.168.0.40:1337/graphql",
                    //url: "http://localhost:1337/storyblocks",
                    method: "post",
                    data: {
                        
                    }
                });
                this.$alertify.alert("This is alert", () =>
                this.$alertify.warning("alert is closed"))
                // this.story = response.data.data.storydefinition;
                // this.storyBlocks = response.data.data.storyblocks;
            } catch (e) {
                this.errors.push(e)
            }    */         
        }
    },
    
    // Fetches posts when the component is created.
    async created() {
        
        try {
            const response = await axios({
                //url: "http://192.168.0.40:1337/graphql",
                url: "http://localhost:1337/graphql",
                method: "post",
                data: {
                    query: `
                    query {
                        storydefinition(id: "`+this.$route.params.id+`") {
                            _id
                            title
                            likes
                            createdAt
                            user {
                                username
                            }
                        }

                        storyblocks(where: {storydefinition:"`+this.$route.params.id+`"}, sort: "order") {
                                _id
                                storyBody
                                createdAt
                                order
                                likes
                                user {
                                    username
                                }
                        }
                    }
                `
                }
            });
            this.story = response.data.data.storydefinition;
            this.storyBlocks = response.data.data.storyblocks;
        } catch (e) {
            this.errors.push(e)
        }
/*             .then(response => {
                // JSON responses are automatically parsed.
                this.story = response.data.data.storydefinition;
                this.storyBlocks = response.data.data.storyblocks;
                console.log(this.story)
                console.log(this.storyBlocks)
            })
            .catch(e => {
                this.errors.push(e);
            }); */

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
.ui.tall.stacked.segment {
    height: 100%;
}

/* .ui.ribbon.label {
    font-size: 2em;
} */

.ui.attached.label {
    font-size: 1em;
}

.ui.translucid {
    background-color: #e8e8e8bb;
    color: #323232;
}

.ui.translucid.inverted {
    background-color: #e8e8e8bb;
    color: #323232;
}

/* Mobile */

@media only screen and (max-width: 767px) {
  [class*="mobile hide"]{
    display: none !important;
  }
}

/* Not Mobile */

@media only screen and (min-width: 768px) {
  [class*="computer hide"]{
    display: none !important;
  }
}

</style>
