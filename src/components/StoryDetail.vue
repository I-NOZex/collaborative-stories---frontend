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
                            {{story.user ? story.user.username : 'Guest'}}
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
                <sui-button basic color="red" content="Like" icon="heart" size="mini" disabled>
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
            </sui-grid-column>
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
                                <textarea placeholder="Let your imagination run wild..." v-model="newSequence" ></textarea>
                                <div is="sui-button" attached="bottom" content="Add Reply" icon="edit" primary v-on:click="addSequence"/>
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
            storyBlocks: [],
            newSequence: '',
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

        validate: async function(){
            const threshold = 0.10;
            const sequenceWords = this.newSequence
                .replace(/[^a-zA-Z]/g, " ")
                .replace(/\s{2,}/g, " ")
                .toLowerCase()
                .split(' ');

            if (sequenceWords.length <= 10) return false;
            
            const response = await axios.get(`https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json`);
            const wordList = Object.keys(response.data);

            let unknownWords = [];
            let longestWord = 0;
            let isValid = false;


            isValid = sequenceWords.every(word => {
                if(word.length > longestWord){
                    longestWord = word.length;
                }


                if(word == "" || wordList.indexOf(word) !== -1) {
                    return true;
                } else {
                    unknownWords.push(word);
                }
                
                if( unknownWords.length >= (sequenceWords.length * threshold) ){
                    return false;
                }
                return true;
            })


            if(isValid){
                // see: http://www.wolframalpha.com/input/?i=average+english+word+length
                if( longestWord <= 5 ){
                    console.info(`too much short words `)
                    isValid = false;
                }                
            }


            console.info(`total unknown words: ${unknownWords.length}`)
            console.info(`threshold unknown words: ${(sequenceWords.length * threshold) }`)
            console.info(`longest word : ${(longestWord) }`)
            console.info(isValid ? 'valid' : 'invalid' )

            return isValid;
        },

        submitSequence: async function(){

            const data = {
                storyBody: this.newSequence,
                order: this.storyBlocks.length - 1,
                storydefinition: this.story._id
            }

            await axios({
                url: "http://localhost:1337/storyblock",
                method: "post",
                timeout: 5000,
                data: data
            }).then(response => {
                    this.$alertify.success("Sequence added!")
                    this.storyBlocks.push(response.data)
            }).catch(error => {
                this.$alertify.error("Error")
            });
        },

        addSequence: function(){
            this.validate()
                .then(isValid => {
                    if (!isValid){
                        //trow error
                        alert('The text doesn\'t respect our rules. Change it and try again')
                    } else {
                        this.submitSequence();
                    }

                })
        }
    },
    
    // Fetches posts when the component is created.
    async created() {
        
        try {
            const response = await axios({
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
