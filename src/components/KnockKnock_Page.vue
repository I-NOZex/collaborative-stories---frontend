<template>
<sui-grid centered vertical-align="middle">
    <sui-grid-column>

        <h2 is="sui-header" text-align="center">
            <sui-header-content>Who's there?</sui-header-content>
        </h2>

        <sui-form v-if="loginActivated">
            <sui-segment stacked>
                <sui-form-field>
                    <sui-input type="email" placeholder="E-mail address" icon="user" icon-position="left" />
                </sui-form-field>
                <sui-form-field>
                    <sui-input type="password" placeholder="Password" icon="lock" icon-position="left" />
                </sui-form-field>
                <sui-button size="large" primary fluid>Login</sui-button>
            </sui-segment>
        </sui-form>

        <sui-form v-if="registerActivated">
            <sui-segment stacked>
                <sui-form-field>
                    <sui-input type="text" placeholder="Name" icon="user" icon-position="left" />
                </sui-form-field>
                <sui-form-field>
                    <sui-input type="email" placeholder="E-mail address" icon="user" icon-position="left" />
                </sui-form-field>
                <sui-form-field>
                    <sui-input type="password" placeholder="Password" icon="lock" icon-position="left" />
                </sui-form-field>
                <sui-form-field>
                    <sui-input type="password" placeholder="Repeat password" icon="lock" icon-position="left" />
                </sui-form-field>
                <sui-button size="large" positive fluid>Join</sui-button>
            </sui-segment>
        </sui-form>

        <sui-divider horizontal>Or</sui-divider>

        <sui-segment text-align="center" v-if="loginActivated">
            <sui-button content="Join now!" icon="edit outline" size="big" v-on:click="showRegister" color="green" basic positive />
            <sui-button social="facebook" content="Facebook" icon="facebook" size="big" style="display:none" />
            <sui-button social="twitter" content="Twitter" icon="twitter" size="big" style="display:none" />
        </sui-segment>

        <sui-segment text-align="center" v-if="registerActivated">
            <sui-button content="I already have an account" icon="arrow left" size="big" v-on:click="showLogin" basic secondary/>
        </sui-segment>
    </sui-grid-column>
</sui-grid>
</template>

<script>
export default {
    name: 'KnockKnock_Page',
    methods: {
        showRegister: function () {
            this.registerActivated = true;
            this.loginActivated = false;
        },
        showLogin: function () {
            this.loginActivated = true;
            this.registerActivated = false;
        },
    },
    data() {
        return {
            registerActivated: false,
            loginActivated: true,
        };
    },
};
</script>

<style>
.grid {
    height: 100%;
}

.column {
    max-width: 450px;
    text-align: center !important;
}
</style>
