<template>
<div id="app">
    <sui-menu fixed inverted>
        <sui-container fluid>
            <router-link :to="{name: 'Index_Page'}" is="sui-menu-item" class="header">
                <img src="/static/images/logo.png" class="logo">
            &nbsp;&nbsp;StoryTime
            </router-link>

                <sui-menu-menu position="right" v-if="this.$store.getters.isAuthenticated && this.$store.getters.isProfileLoaded">
                    <sui-menu-item right>
                        <span>Welcome back <b>{{this.$store.getters.getProfile.username}}</b></span>
                    </sui-menu-item>
                    <a is="sui-menu-item" v-on:click="logout" right>
                        <sui-icon name="sign out alternate" />
                        <span>Logout</span>
                    </a>
                </sui-menu-menu>
        </sui-container>
    </sui-menu>

    <sui-container class="main" fluid>
        <router-view />
    </sui-container>
</div>
</template>

<script>
import { USER_REQUEST } from "./store/actions/user";
import { AUTH_LOGOUT } from "./store/actions/auth";

export default {
    name: "App",
    created() {
        const token = localStorage.getItem('user-token')
        if (token) {
            this.$store.dispatch(USER_REQUEST);
        }
    },
    methods: {
        logout: function () {
            this.$store.dispatch(AUTH_LOGOUT)
                .then(() => {
                    this.$router.push('/knock-knock')
                })
        }
    },
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    color: #2c3e50;
    margin-top: 3.79em;
    padding: 20px;
}
</style>
