<template lang="html">
<div>
    <sui-grid stackable>
        <sui-grid-row>

            <sui-grid-column :width="8">
                <sui-segment stacked="tall">
                    <div class="ui fluid image">
                        <sui-image
                            shape="rounded"
                            src="https://semantic-ui-vue.github.io/static/images/avatar/large/daniel.jpg"
                        />
                        <div class="ui ribbon label translucid massive mobile hide">
                            {{story.title}}
                        </div>

                        <div class="ui ribbon label translucid medium computer hide">
                            {{story.title}}
                        </div>

                        <sui-label
                            attached="bottom right"
                            image
                            color="teal"
                        >
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
                <sui-button
                    basic
                    color="red"
                    content="Like"
                    icon="heart"
                    size="mini"
                >
                    <a
                        is="sui-label"
                        slot="label"
                        basic
                        color="red"
                        pointing="left"
                    >
                        {{story.likes ? story.likes.length : 0}}
                    </a>
                </sui-button>

                <sui-button
                    basic
                    color="blue"
                    content="Share"
                    icon="facebook"
                    size="mini"
                >
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
        <h3
            is="sui-header"
            dividing
        >Sequences</h3>

        <sui-comment
            v-for="(storyBlock, idx) in storyBlocks"
            :key="idx"
            v-if="storyBlock.order > 0"
        >
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
                            <sui-icon
                                name="heart"
                                color="red"
                            /> You and 1234 others like this
                        </sui-comment-action>
                        <sui-comment-action>
                            <sui-icon name="facebook outline" /> Share
                        </sui-comment-action>
                    </sui-comment-actions> -->
            </sui-comment-content>
            <sui-divider hidden />
        </sui-comment>

        <form
            class="ui reply form"
            id="add-sequence"
        >
            <sui-comment>
                <sui-comment-avatar :src="this.$store.getters.getAvatarImage || 'https://semantic-ui-vue.github.io/static/images/avatar/small/jenny.jpg'" />
                <sui-comment-content>
                    <router-link
                        :to="{name: 'Account_Page', params: { id: this.$store.getters.getProfile._id }}"
                        is="sui-comment-author"
                    >
                        {{this.$store.getters.getProfile.username}}
                    </router-link>
                    <sui-comment-text>
                        <sui-segment stacked="tall">
                            <textarea
                                placeholder="Let your imagination run wild..."
                                v-model="newSequence"
                            ></textarea>
                            <div
                                is="sui-button"
                                attached="bottom"
                                content="Add Reply"
                                icon="edit"
                                primary
                                v-on:click="addSequence"
                            />
                        </sui-segment>
                    </sui-comment-text>
                    <sui-divider hidden />
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
import Stories from "@/services/api/Stories";

Vue.use(VueAlertify)

export default {
    name: "StoryDetail_Page",

    data() {
        return {
            story: {},
            storyBlocks: [],
            newSequence: '',
            errors: []
        };
    },

    mounted() {
        const anchor = this.$router.currentRoute.hash;
        this.$nextTick(() => {
            if (anchor && document.querySelector(anchor)) {
                var elmnt = document.querySelector(anchor);
                setTimeout(() => {
                    elmnt.scrollIntoView(true);
                }, 5);
            }
        });
    },

    filters: {
        timeAgo: function (date) {
            return moment(date).fromNow();
        },
        firstStoryText: function (arr) {
            if (!Array.isArray(arr)) return [];
            if (arr.length < 1) return [];
            return arr[0].storyBody;
        }
    },

    methods: {

        validate: async function () {
            const threshold = 0.10;
            const sequenceWords = this.newSequence
                .replace(/[^a-zA-Z]/g, " ")
                .replace(/\s{2,}/g, " ")
                .toLowerCase()
                .split(' ');

            if (sequenceWords.length <= 10) return false;

            const response = await axios.get(`/static/words_dictionary.json`);
            const wordList = Object.keys(response.data);

            let unknownWords = [];
            let longestWord = 0;
            //let nrChanges = 0;
            let isValid = false;

            isValid = sequenceWords.every(word => {
                if (word.length > longestWord) {
                    longestWord = word.length;
                    //nrChanges++;
                }

                if (word == "" || wordList.indexOf(word) !== -1) {
                    return true;
                } else {
                    unknownWords.push(word);
                }

                if (unknownWords.length >= (sequenceWords.length * threshold)) {
                    return false;
                }
                return true;
            })

            console.info(isValid ? 'not troll' : 'is troll')

            if (isValid) {
                /* if( nrChanges <= (sequenceWords.length * threshold) ){
                    console.info(`not enough changes `)
                    isValid = false;
                } */
                // see: http://www.wolframalpha.com/input/?i=average+english+word+length
                if (longestWord <= 5) {
                    console.info(`too much short words `)
                    isValid = false;
                }
            }

            console.info(`total unknown words: ${unknownWords.length}`)
            console.info(`threshold unknown words: ${(sequenceWords.length * threshold) }`)
            console.info(`longest word : ${(longestWord) }`)
            //console.info(`nr changes : ${(nrChanges) }`)
            console.info(isValid ? 'not troll' : 'is troll')

            return isValid;
        },

        submitSequence: function () {

            const data = {
                storyBody: this.newSequence,
                order: _.last(this.storyBlocks).order + 1,
                storydefinition: this.story._id,
                user: this.$store.getters.getProfile._id
            }

            Stories.createStorySequence(data)
                .then(response => {
                    this.$alertify.success("Sequence added!")
                    this.storyBlocks.push(response.data)
                }).catch(error => {
                    this.$alertify.error("Error")
                });
        },

        addSequence: function () {
            this.validate()
                .then(isValid => {
                    if (!isValid) {
                        //trow error
                        alert('get a life your troll')
                    } else {
                        this.submitSequence();
                    }

                })
        }
    },

    // Fetches posts when the component is created.
    created() {
        Stories.getStoryDefinition(this.$route.params.id)
            .then(response => {
                this.story = response.data.data.storydefinition;
                this.storyBlocks = response.data.data.storyblocks;
            }).catch(e => {
                this.errors.push(e)
            })
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
    [class*="mobile hide"] {
        display: none !important;
    }
}

/* Not Mobile */

@media only screen and (min-width: 768px) {
    [class*="computer hide"] {
        display: none !important;
    }
}
</style>
