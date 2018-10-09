<template>
<sui-grid centered vertical-align="middle">
    <sui-grid-column>

        <h2 is="sui-header" text-align="center">
            <sui-header-content>Who's there?</sui-header-content>
        </h2>

        <sui-form v-if="loginActivated">
            <sui-segment stacked>
                <sui-form-field>
                    <sui-input type="email" placeholder="E-mail address" icon="envelope" icon-position="left" />
                </sui-form-field>
                <sui-form-field>
                    <sui-input type="password" placeholder="Password" icon="lock" icon-position="left" />
                </sui-form-field>
                <sui-form-field>
                    <sui-checkbox label="Remember me" />
                </sui-form-field>            
                <sui-button size="large" primary fluid>Login</sui-button>
            </sui-segment>
        </sui-form>

        <sui-form @submit.prevent="requestRegister" v-if="registerActivated">
            <sui-segment stacked>
                <sui-form-field>
                    <sui-input type="text" placeholder="Name" icon="user" icon-position="left" v-model="registerForm.username"/>
                </sui-form-field>
                <sui-form-field>
                    <sui-input type="email" placeholder="E-mail address" icon="envelope" icon-position="left" v-model="registerForm.email"/>
                </sui-form-field>
                <sui-form-field>
                    <sui-input type="password" placeholder="Password" icon="lock" icon-position="left" v-model="registerForm.password"/>
                </sui-form-field>
                <sui-form-field>
                    <sui-input type="password" placeholder="Repeat password" icon="lock" icon-position="left" />
                </sui-form-field>
                <vue-recaptcha :sitekey="secrets.recaptcha_sitekey" size="invisible">
                </vue-recaptcha>                
                <sui-button size="large" positive fluid>Join</sui-button>
            </sui-segment>
        </sui-form>

        <sui-divider horizontal>Or</sui-divider>

        <div class="text-center" v-if="loginActivated">
            <sui-button content="Join now!" icon="edit outline" size="big" v-on:click="showRegister" color="green" positive />
            <sui-button social="facebook" content="Facebook" icon="facebook" size="big" style="display:none" />
            <sui-button social="twitter" content="Twitter" icon="twitter" size="big" style="display:none" />
        </div>

        <div class="text-center" v-if="registerActivated">
            <sui-button content="I already have an account" icon="arrow left" size="big" v-on:click="showLogin" secondary/>
        </div>
    </sui-grid-column>
</sui-grid>
</template>

<script>
import Vue from 'vue';
import axios from "axios";
import VueRecaptcha from 'vue-recaptcha';
import VueAlertify from "vue-alertify";
import secrets from "./../secrets.json";
Vue.use(VueAlertify)

export default {
    name: 'KnockKnock_Page',
    components: { VueRecaptcha },
    data() {
        return {
            registerActivated: false,
            loginActivated: true,
            secrets: secrets,
            registerForm: {
                username: '',
                email: '',
                password: ''
            }
        };
    },
    methods: {
        showRegister: function () {
            this.registerActivated = true;
            this.loginActivated = false;
        },
        showLogin: function () {
            this.loginActivated = true;
            this.registerActivated = false;
        },
        requestRegister: async function(){
            await axios({
                url: "http://192.168.0.40:1337/auth/local/register",
                method: "post",
                timeout: 5000,
                data: this.registerForm
            }).then(response => {
                    this.$alertify.success("Registed");
                    this.showLogin();
            }).catch(error => {
                this.$alertify.error("Error")
            });
        }        
    },
};
</script>


<!-- see: https://vue-loader.vuejs.org/guide/scoped-css.html -->
<style scoped>
.grid {
    height: 100%;
}

.column {
    max-width: 450px;
}

.text-center{
    text-align: center;
}
</style>
