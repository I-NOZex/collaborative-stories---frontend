<template>
<sui-grid centered vertical-align="middle">
    <sui-grid-column>

        <h2 is="sui-header" text-align="center">
            <sui-header-content>Who's there?</sui-header-content>
        </h2>

        <sui-form @submit.prevent="requestLogin" v-if="loginActivated">
            <sui-segment stacked>
                <sui-form-field>
                    <sui-input type="email" placeholder="E-mail address" icon="envelope" icon-position="left" v-model="loginForm.identifier" required/>
                </sui-form-field>
                <sui-form-field>
                    <sui-input type="password" placeholder="Password" icon="lock" icon-position="left" v-model="loginForm.password" required/>
                </sui-form-field>
                <sui-form-field>
                    <sui-checkbox label="Remember me" v-model="loginForm.rememberMe"/>
                </sui-form-field>            
                <sui-button size="large" primary fluid>Login</sui-button>
            </sui-segment>
        </sui-form>

        <sui-form @submit.prevent="requestRegister" v-if="registerActivated" novalidate="true">
            <sui-segment stacked>
                <sui-message v-if="errors.length" negative>
                    <sui-message-header>Please correct the following error(s):</sui-message-header>
                    <ul>
                        <li v-for="error in errors" :key="error">{{ error }}</li>
                    </ul>
                </sui-message>

                <sui-form-field v-bind:error="formErrors.registerFields.username.length > 1"> 
                    <sui-input type="text" placeholder="Name" icon="user" icon-position="left" v-model="registerForm.username"/>
                    <sui-label basic color="red" pointing="left" v-if="formErrors.registerFields.username.length > 1"> {{formErrors.registerFields.username}} </sui-label>
                </sui-form-field>

                <sui-form-field v-bind:error="formErrors.registerFields.email.length > 1">
                    <sui-input type="email" placeholder="E-mail address" icon="envelope" icon-position="left" v-model="registerForm.email"/>
                    <sui-label basic color="red" pointing="left" v-if="formErrors.registerFields.email.length > 1"> {{formErrors.registerFields.email}} </sui-label>
                </sui-form-field>

                <sui-form-field v-bind:error="formErrors.registerFields.password.length > 1">
                    <sui-input type="password" placeholder="Password" icon="lock" icon-position="left" v-model="registerForm.password"/>
                    <sui-label basic color="red" pointing="left" v-if="formErrors.registerFields.password.length > 1"> {{formErrors.registerFields.password}} </sui-label>
                </sui-form-field>

                <sui-form-field v-bind:error="formErrors.registerFields.repeatPassword.length > 1">
                    <sui-input type="password" placeholder="Repeat password" icon="lock" icon-position="left" v-model="registerForm.repeatPassword"/>
                    <sui-label basic color="red" pointing="left" v-if="formErrors.registerFields.repeatPassword.length > 1"> {{formErrors.registerFields.repeatPassword}} </sui-label>
                </sui-form-field>

                <vue-recaptcha :sitekey="secrets.recaptcha_sitekey" size="invisible">
                </vue-recaptcha>               

                <sui-button size="large" primary fluid>Join</sui-button>
            </sui-segment>
        </sui-form>

        <sui-divider horizontal>Or</sui-divider>

        <div class="text-center" v-if="loginActivated">
            <sui-button content="Join now!" icon="edit outline" size="big" v-on:click="showRegister" positive/>
            <sui-button social="facebook" content="Facebook" icon="facebook" size="big" style="display:none" />
            <sui-button social="twitter" content="Twitter" icon="twitter" size="big" style="display:none" />
        </div>

        <div class="text-center" v-if="registerActivated">
            <sui-button content="I already have an account" icon="arrow left" size="big" v-on:click="showLogin" positive/>
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

const opts = {
  notifier:{
      delay: 10,
  }
}
 
Vue.use(VueAlertify, opts)

export default {
    name: 'KnockKnock_Page',
    components: { VueRecaptcha },
    data() {
        return {
            errors: [],
            user: null,
            registerActivated: false,
            loginActivated: true,
            secrets: secrets,
            registerForm: {
                username: '',
                email: '',
                password: '',
                repeatPassword: ''
            },
            loginForm: {
                identifier: localStorage.lastuser || '',
                password: '',
                rememberMe: false,
            },            
            formErrors: {
                hasErrors: false,
                registerFields : {
                    username: '',
                    email: '',
                    password: '',
                    repeatPassword: '' 
                }             
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
        validEmail:function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        validateForm: function(fields){
            this.formErrors = {
                hasErrors: false,
                registerFields : {
                    username: '',
                    email: '',
                    password: '',
                    repeatPassword: '' 
                }                
            };

            if(this.registerForm.username.length < 1){ 
                this.formErrors.registerFields.username = ("Name is required.");
                this.formErrors.hasErrors  = true;
            }

            if(!this.registerForm.email) {
                this.formErrors.registerFields.email = ("Email required.");
                this.formErrors.hasErrors  = true;

            } else if(!this.validEmail(this.registerForm.email)) {
                this.formErrors.registerFields.email = ("Valid email required.");
                this.formErrors.hasErrors  = true;
            }

            if(this.registerForm.password.length < 1) {
                this.formErrors.registerFields.password = ("Password is required.");
                this.formErrors.hasErrors  = true;
            }

            if(this.registerForm.repeatPassword.length < 1) {
                this.formErrors.registerFields.repeatPassword = ("Repeat Password is required.");
                this.formErrors.hasErrors  = true;

            } else if(this.registerForm.repeatPassword !== this.registerForm.password) {
                this.formErrors.registerFields.repeatPassword = ("The passwords are different.");
                this.formErrors.hasErrors  = true;
            }

            return this.formErrors.hasErrors  ? false : true;
        },
        requestRegister: async function(){
            if( !this.validateForm() ) return false;

            await axios({
                url: "http://192.168.0.40:1337/auth/local/register",
                method: "post",
                timeout: 5000,
                data: this.registerForm
            }).then(response => {
                    this.$alertify.success("Registed");
                    this.showLogin();
            }).catch(error => {
                console.log(error)
                this.errors.push(error.response.data.message)
                this.$alertify.error(`<b>Error:</b> ${error.response.data.message}`)
            });
        },
        requestLogin: async function(){
            if(this.loginForm.rememberMe){
                localStorage.setItem("lastuser", this.loginForm.identifier);
            }
            await axios({
                url: "http://192.168.0.40:1337/auth/local",
                method: "post",
                timeout: 5000,
                data: this.loginForm
            }).then(response => {
                this.user = response.data.user;
                this.$alertify.success(`Welcome back: <b>${response.data.user.username}</b>!`);
                this.showLogin();
            }).catch(error => {
                console.log(error)
                this.$alertify.error(`Error`)
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

.ui.pointing.label{
    position: absolute;
    white-space: nowrap;
    margin-top: 0.4rem;
}
</style>
