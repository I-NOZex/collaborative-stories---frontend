<template>
<sui-grid centered vertical-align="middle">
    <sui-grid-column>

        <h2 is="sui-header" text-align="center">
            <sui-header-content>Who's there?</sui-header-content>
        </h2>

        <!--=== LOGIN FORM ========================-->
        <sui-form @submit.prevent="requestLogin" v-if="loginActivated">
            <sui-segment stacked>

                <sui-form-field v-for="(fieldData, fieldKey) in loginModel.fields" :key="fieldKey" v-bind:error="!fieldData.isValid" v-if="!fieldData.skipRender">
                    <sui-input :type="fieldData.type" :placeholder="fieldData.placeholder" :icon="fieldData.icon" icon-position="left" v-model="fieldData.value" />
                    <sui-label basic color="red" pointing="left" v-if="!fieldData.isValid"> {{fieldData.errorMsg}} </sui-label>
                </sui-form-field>

                <sui-form-field>
                    <sui-checkbox :label="loginModel.fields.rememberMe.placeholder" v-model="loginModel.fields.rememberMe.value" />
                </sui-form-field>
                <sui-button size="large" primary fluid>Login</sui-button>
            </sui-segment>
        </sui-form>

        <!--=== REGISTRATION FORM ========================-->
        <sui-form @submit.prevent="requestRegister" v-if="registerActivated" novalidate="true">
            <sui-segment stacked>
                <sui-message v-if="errors.length" negative>
                    <sui-message-header>Please correct the following error(s):</sui-message-header>
                    <ul>
                        <li v-for="error in errors" :key="error">{{ error }}</li>
                    </ul>
                </sui-message>

                <sui-form-field v-for="(fieldData, fieldKey) in registerModel.fields" :key="fieldKey" v-bind:error="!fieldData.isValid">
                    <sui-input :type="fieldData.type" :placeholder="fieldData.placeholder" :icon="fieldData.icon" icon-position="left" v-model="fieldData.value" />
                    <sui-label basic color="red" pointing="left" v-if="!fieldData.isValid"> {{fieldData.errorMsg}} </sui-label>
                </sui-form-field>

                <vue-recaptcha :sitekey="secrets.recaptcha_sitekey" size="invisible">
                </vue-recaptcha>

                <sui-button size="large" primary fluid>Join</sui-button>
            </sui-segment>
        </sui-form>

        <sui-divider horizontal>Or</sui-divider>

        <div class="text-center" v-if="loginActivated">
            <sui-button content="Join now!" icon="edit outline" size="big" v-on:click="showRegister" positive />
            <sui-button social="facebook" content="Facebook" icon="facebook" size="big" style="display:none" />
            <sui-button social="twitter" content="Twitter" icon="twitter" size="big" style="display:none" />
        </div>

        <div class="text-center" v-if="registerActivated">
            <sui-button content="I already have an account" icon="arrow left" size="big" v-on:click="showLogin" positive />
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
import {AUTH_REQUEST} from '@/store/actions/auth'
import {USER_SUCCESS} from '@/store/actions/user'
import formValidations from "@/mixins/formValidations"


const opts = {
    notifier: {
        delay: 10,
    }
}

Vue.use(VueAlertify, opts)

export default {
    name: 'KnockKnock_Page',
    mixins: [formValidations],
    components: {
        VueRecaptcha
    },
    data() {
        return {
            errors: [],
            user: null,
            registerActivated: false,
            loginActivated: true,
            secrets: secrets,
            loginModel: {
                isValid: true,
                fields: {
                    identifier: {
                        type: 'text',
                        placeholder: 'E-mail address',
                        icon: 'envelope',
                        value: localStorage.lastuser || '',
                        validationRules: [],
                        isValid: true,
                        errorMsg: '',
                        skipRender: false
                    },
                    password: {
                        type: 'password',
                        placeholder: 'Password',
                        icon: 'lock',
                        value: '',
                        validationRules: [],
                        isValid: true,
                        errorMsg: '',
                        skipRender: false
                    },
                    rememberMe: {
                        placeholder: 'Remember me',
                        value: localStorage.lastuser ? true : false,
                        skipRender: true
                    }
                }
            },            

            registerModel: {
                isValid: true,
                fields: {
                    username: {
                        type: 'text',
                        placeholder: 'Name',
                        icon: 'user',
                        value: '',
                        validationRules: ['required'],
                        isValid: true,
                        errorMsg: ''
                    },
                    email: {
                        type: 'text',
                        placeholder: 'E-mail address',
                        icon: 'envelope',
                        value: '',
                        validationRules: ['required', 'email'],
                        isValid: true,
                        errorMsg: ''
                    },
                    password: {
                        type: 'password',
                        placeholder: 'Password',
                        icon: 'lock',
                        value: '',
                        validationRules: ['required', ],
                        isValid: true,
                        errorMsg: ''
                    },
                    repeatPassword: {
                        type: 'password',
                        placeholder: 'Repeat Password',
                        icon: 'lock',
                        value: '',
                        validationRules: ['required', '=password'], //FIXME: review the other possible approach `['=', 'repeatPassword']` 
                        isValid: true,
                        errorMsg: ''
                    },
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
        requestRegister: async function () {
            if (!this.validateForm(this.registerModel)) return false;

            const registerData = {
                username: this.registerModel.fields.username.value,
                email: this.registerModel.fields.email.value,
                password: this.registerModel.fields.password.value,
                repeatPassword: this.registerModel.fields.repeatPassword.value
            }

            await axios({
                url: "http://127.0.0.1:1337/auth/local/register",
                method: "post",
                timeout: 5000,
                data: registerData
            }).then(response => {
                this.$alertify.success("Registed");
                const token = response.data.jwt
                localStorage.setItem('user-token', token)
                // Add the following line:
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                this.$store.dispatch(USER_SUCCESS, response);
                this.$router.push('/');
            }).catch(error => {
                console.log(error)
                this.errors.push(error)
                this.$alertify.error(`<b>Error:</b>`)
            });
        },

        requestLogin: async function () {
            if (this.loginModel.fields.rememberMe.value === true) {
                localStorage.setItem("lastuser", this.loginModel.fields.identifier.value);
            } else {
                localStorage.removeItem('lastuser');
            }

            const loginData = {
                identifier: this.loginModel.fields.identifier.value,
                password: this.loginModel.fields.password.value,
            }

            this.$store.dispatch(AUTH_REQUEST, loginData)
            .then(response => {
                this.user = response.data.user;
                this.$alertify.success(`Welcome back: <b>${response.data.user.username}</b>!`);
                this.showLogin();
                this.$router.push('/')
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

.text-center {
    text-align: center;
}

.ui.pointing.label {
    position: absolute;
    white-space: nowrap;
    margin-top: 0.4rem;
}
</style>
