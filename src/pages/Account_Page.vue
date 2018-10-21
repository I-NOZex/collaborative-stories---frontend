<template lang="html">
<div>
    <sui-segment>
        <sui-header icon text-align="center">
            <sui-icon name="users" circular />
            <sui-header-content>
                <h2>{{profile.username}}</h2>
                <span>{{profile.email}}</span>
            </sui-header-content>
        </sui-header>
        <sui-divider />

        <sui-menu secondary>
            <a
            is="sui-menu-item"
            v-for="item in menu.items"
            :active="isActive(item)"
            :key="item"
            :content="item"
            @click="select(item)"
            />
            <sui-menu-menu position="right">
                <a
                is="sui-menu-item"
                :active="isActive('Settings')"
                content="Settings"
                @click="select('Settings')"
                />
            </sui-menu-menu>
        </sui-menu>    
    </sui-segment>

    <!-- ======= GRID ========== -->
        <stories-list :stories="myStories" v-if="isActive('My Stories')"></stories-list>
        <profile-form v-if="isActive('Settings')"></profile-form>

</div>
</template>

<script>
import StoriesList from "@/components/stories-list.vue";
import ProfileForm from "@/components/profile-form.vue";
import Stories from "@/services/api/Stories";
import countStoryResults from "@/mixins/countStoryResults"
import formValidations from "@/mixins/formValidations"



export default {
    name: "Account_Page",
    mixins: [countStoryResults, formValidations],
    components: {
        StoriesList,
        ProfileForm
    },
    data() {
        return {
            menu: {
                active: 'My Stories',
                items: ['My Stories', 'My Sequences', 'Likes'],
            },
            myStories: []
        }
    },
    computed:{
        profile(){
            return this.$store.getters.getProfile
        }
    },    
    methods: {
        isActive(name) {
            return this.menu.active === name;
        },
        select(name) {
            this.menu.active = name;
        },
    },  
      
    created(){
        Stories.getStoryDefinitions( `where: {user:"${this.profile._id}"}` )
        .then(response => {
            this.myStories = response.data.data.storydefinitions;
            this.setCountStoryResults(`where: {user:"${this.profile._id}"}`, this.myStories)
        })
        .catch(e => {
            this.errors.push(e);
        });

              
    }
}
</script>

<style scoped>
.ui.secondary.pointing.menu {
    margin-bottom: -1em;
    position: relative;
    border-color: transparent;
}
</style>
