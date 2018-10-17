import _ from "lodash";
import Stories from "@/services/api/Stories";
import Vue from "vue";


export default {
    methods: {
        setCountStoryResults(_filter, _model) {
            Stories.getStoryDefinitionsCount(_filter).then(storyblocksCount => {
                let stories = [];
                //sum each storydefinition sequences
                const blocks = _.forEach(
                    storyblocksCount.data.data.storydefinitions,
                    obj => {
                        // Vue.set(story, "totalBlocks", obj.storyblocks.length);
                        stories.push({
                            _id: obj._id,
                            totalBlocks: obj.storyblocks.length
                        });
                    }
                );
                
                _model.forEach(story => {
                    const storyCount = _.find(
                        stories,
                        obj => obj._id === story._id
                    );
                    Vue.set(story, "totalBlocks", storyCount.totalBlocks);
                });
            });
        }
    }
};