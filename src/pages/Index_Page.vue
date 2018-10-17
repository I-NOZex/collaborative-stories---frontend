<template lang="html">
<div>
    <stories-list :stories="stories"></stories-list>
</div>
</template>

<script>
import StoriesList from "@/components/stories-list.vue"
import Stories from "@/services/api/Stories";
import countStoryResults from "@/mixins/countStoryResults"

export default {
    name: "Index_Page",
    mixins: [countStoryResults],

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
         Stories.getStoryDefinitions()
        .then((response) => {
            // JSON responses are automatically parsed.
            this.stories = response.data.data.storydefinitions;
            this.setCountStoryResults(null, this.stories)
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