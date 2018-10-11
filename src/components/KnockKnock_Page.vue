<template>
<sui-grid centered vertical-align="middle">
    <sui-grid-column>

        <h2 is="sui-header" text-align="center">
            <sui-header-content>Who's there?</sui-header-content>
        </h2>

        <!--=== LOGIN FORM ========================-->
        <sui-form @submit.prevent="requestLogin" v-if="loginActivated">
            <sui-segment stacked>

                <sui-form-field v-for="(fieldData, fieldKey) in loginModel.fields" :key="fieldKey" v-bind:error="!fieldData.isValid">
                    <sui-input :type="fieldData.type" :placeholder="fieldData.placeholder" :icon="fieldData.icon" icon-position="left" v-model="fieldData.value" />
                    <sui-label basic color="red" pointing="left" v-if="!fieldData.isValid"> {{fieldData.errorMsg}} </sui-label>
                </sui-form-field>

                <sui-form-field>
                    <sui-checkbox label="Remember me" v-model="loginForm.rememberMe" />
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

const opts = {
    notifier: {
        delay: 10,
    }
}

Vue.use(VueAlertify, opts)

export default {
    name: 'KnockKnock_Page',
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
                registerFields: {
                    username: '',
                    email: '',
                    password: '',
                    repeatPassword: ''
                }
            },

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
                        errorMsg: ''
                    },
                    password: {
                        type: 'password',
                        placeholder: 'Password',
                        icon: 'lock',
                        value: '',
                        validationRules: [],
                        isValid: true,
                        errorMsg: ''
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
        validEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        validateForm: function (model) {
            model.isValid = true;

            Object.keys(model.fields).forEach(key => {
                const field = model.fields[key];
                const rules = field.validationRules;

                field.isValid = true;
                field.errorMsg = '';

                rules.forEach(rule => { //FIXME: Consider use `lodash` or other function that allows to skip a iteration cycle

                        if(field.isValid && rule === 'required') {
                            if ( field.value.length < 1 ) {
                                field.errorMsg = `${field.placeholder} is required.`;
                                field.isValid = false;
                                model.isValid = false;
                            }

                        } else if(field.isValid && rule === 'email') {
                            if ( !this.validEmail(field.value.email) ) {
                                field.errorMsg = `${field.placeholder} is not valid.`;
                                field.isValid = false;
                                model.isValid = false;
                            }

                        } else if(field.isValid && rule.startsWith('=')){
                            const comparationFieldName = rule.substring(1);

                            if( model.fields.hasOwnProperty(comparationFieldName) ){
                                const comparationField = model.fields[comparationFieldName];
                                console.log(field.value, comparationField.value)
                                if( field.value !== comparationField.value ){
                                    field.errorMsg = `${field.placeholder} must be equal to ${comparationField.placeholder}.`;
                                    field.isValid = false;
                                    model.isValid = false;
                                }
                            } else {
                                console.error(`"${rule}" is invalid.`)
                            }
                        }
                    
                });
            });
 /*            this.formErrors = {
                hasErrors: false,
                registerFields: {
                    username: '',
                    email: '',
                    password: '',
                    repeatPassword: ''
                }
            };

            if (this.registerForm.username.length < 1) {
                this.formErrors.registerFields.username = ("Name is required.");
                this.formErrors.hasErrors = true;
            }

            if (!this.registerForm.email) {
                this.formErrors.registerFields.email = ("Email required.");
                this.formErrors.hasErrors = true;

            } else if (!this.validEmail(this.registerForm.email)) {
                this.formErrors.registerFields.email = ("Valid email required.");
                this.formErrors.hasErrors = true;
            }

            if (this.registerForm.password.length < 1) {
                this.formErrors.registerFields.password = ("Password is required.");
                this.formErrors.hasErrors = true;
            }

            if (this.registerForm.repeatPassword.length < 1) {
                this.formErrors.registerFields.repeatPassword = ("Repeat Password is required.");
                this.formErrors.hasErrors = true;

            } else if (this.registerForm.repeatPassword !== this.registerForm.password) {
                this.formErrors.registerFields.repeatPassword = ("The passwords are different.");
                this.formErrors.hasErrors = true;
            } */
console.log(model); return false;
            return model.isValid;
        },
        requestRegister: async function () {
                if (!this.validateForm(this.registerModel)) return false;

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
            requestLogin: async function () {
                if (this.loginForm.rememberMe) {
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

.text-center {
    text-align: center;
}

.ui.pointing.label {
    position: absolute;
    white-space: nowrap;
    margin-top: 0.4rem;
}
</style>
