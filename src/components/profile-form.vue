<template>
<sui-segment>
    <sui-grid relaxed="very" stackable vertical-align="middle" centered>
        <sui-grid-column width="four">

            <sui-card>
                <sui-image :src="`${this.$store.getters.getAvatarImage}` || 'https://semantic-ui-vue.github.io/static/images/avatar/large/steve.jpg'" />
                <sui-button 
                    attached="bottom" 
                    :loading="this.uploadStatus == this.STATUS_SAVING" 
                    :error="this.uploadStatus == this.STATUS_FAILED" 
                    @click="$refs.filePicker.click()" 
                    primary>
                    <sui-icon name="upload" /> Select image...
                </sui-button>
                <sui-progress color="green" attached bottom :percent="uploadPercentage" v-if="this.uploadStatus == 1" />
            </sui-card>

            <form novalidate>
                <input type="file" ref="filePicker"  @change="filesChange($event.target.files)"
            accept="image/*" class="input-file">
            </form>

        </sui-grid-column>

        <sui-grid-column width="six">
            <sui-form 
                :error="this.formStatus == this.STATUS_FAILED" 
                :loading="this.formStatus == this.STATUS_SAVING" 
                novalidate="true">
                <sui-form-field v-for="(fieldData, fieldKey) in profileModel.fields" :key="fieldKey" v-bind:error="!fieldData.isValid">
                    <label>{{fieldData.placeholder}}:</label>
                    <sui-input :type="fieldData.type" :placeholder="fieldData.placeholder" :icon="fieldData.icon" icon-position="left" v-model="fieldData.value" />
                    <sui-label basic color="red" pointing="left" v-if="!fieldData.isValid"> {{fieldData.errorMsg}} </sui-label>
                </sui-form-field>
            </sui-form>
        </sui-grid-column>

        <sui-grid-column width="sixteen" textAlign="center">
            <sui-button-group size="big">
                <!-- <input type="reset" is="sui-button" value="Cancel">
                <sui-button-or /> -->
                <sui-button positive icon="save" @click="requestUserUpdate">Save</sui-button>
            </sui-button-group>
        </sui-grid-column>

    </sui-grid>
</sui-segment>
</template>

<script>
import Vue from "vue";
import _ from "lodash";
import {upload} from "@/services/api/Upload";
import {USER_REQUEST} from "@/store/actions/user";
import utils from "@/utils.js";
import User from "@/services/api/User";
import VueAlertify from "vue-alertify";

Vue.use(VueAlertify)


let FIRST_CALL = true;

export default {
    name: 'profileForm',
    data() {
        return {
            STATUS_INITIAL : 0,
            STATUS_SAVING : 1,
            STATUS_SUCCESS : 2,
            STATUS_FAILED : 3,

            uploadError: null,
            uploadStatus: null,
            uploadPercentage: 0,

            formStatus: null,

            profileModel: {
                isValid: true,
                fields: {
                    username: {
                        type: 'text',
                        placeholder: 'Name',
                        icon: 'user',
                        value: '',
                        validationRules: ['required'],
                        isValid: true,
                        errorMsg: '',
                        isChanged: false
                    },
                    email: {
                        type: 'text',
                        placeholder: 'E-mail address',
                        icon: 'envelope',
                        value: '',
                        validationRules: ['required', 'email'],
                        isValid: true,
                        errorMsg: '',
                        isChanged: false
                    },
                    /*TODO: need to workaround the fact that whe need to request a new PW via email confirmation
                    oldPassword: {
                        type: 'password',
                        placeholder: 'Old Password',
                        icon: 'lock',
                        value: '',
                        validationRules: ['required', ],
                        isValid: true,
                        errorMsg: ''
                    },
                    newPassword: {
                        type: 'password',
                        placeholder: 'New Password',
                        icon: 'lock',
                        value: '',
                        validationRules: ['required', ], //FIXME: review the other possible approach `['=', 'repeatPassword']` 
                        isValid: true,
                        errorMsg: ''
                    },
                    */
                }
            },
        }
    },
    computed: {
        //FIXME: some says that this isn't very correct; futher analysis need
        profile() {
            return this.$store.getters.getProfile
        }
    },
      watch: {
        // whenever question changes, this function will run
        'this.profileModel.fields.email.value': {
            handler (newVal, oldVal) {
                if(!FIRST_CALL){
                    profileModel.fields.email.isChanged = (newVal !== oldVal);
                }
                FIRST_CALL = false;
            },
        }
    },
    created() {
        this.profileModel.fields.username.value = this.profile.username;
        this.profileModel.fields.email.value = this.profile.email;

    },
    methods: {
        requestUserUpdate(){
            this.formStatus = this.STATUS_SAVING;
            let userData = {
                username: this.profileModel.fields.username.value,
            }

            if(this.profileModel.fields.email.isChanged)
                userData.email = this.profileModel.fields.email.value;


            User.updateUser(this.profile._id, userData)
            .then(response => {
                this.$store.dispatch(USER_REQUEST);
                this.formStatus = this.STATUS_SUCCESS;
                this.$alertify.success("Profile updated");
            })
            .catch(error =>{
                console.log(error)
                this.formStatus = this.STATUS_FAILED;
            })
        },
        onProgress(progress) {
            this.uploadPercentage = progress
        },
        save(formData) {
            // upload data to the server
            this.uploadStatus = this.STATUS_SAVING;
            this.uploadPercentage = 0;

            upload(formData, this.onProgress)
                .then(response => {
                    const photo = _.first(response.data);
                    this.$store.dispatch(USER_REQUEST);
                    //this.uploadedFiles = [].concat(x);
                    this.uploadStatus = this.STATUS_SUCCESS;
                    this.uploadPercentage = 0;
                    this.$alertify.success("Avatar updated");
                })
                .catch(err => {
                    this.uploadError = err.response;
                    this.uploadStatus = this.STATUS_FAILED;
                });
        },
        filesChange(fileList) {
            
            // handle file changes
            var formData = new FormData();
            if (!fileList.length) return;

            const fileData = _.first(fileList);
            // append the files to FormData

            formData.append("files", fileData, fileData.name); // Buffer or stream of file(s)
            formData.append("path", "user/avatar"); // Uploading folder of file(s)
            formData.append("refId", this.profile._id); // User's Id
            formData.append("ref", "user", ); // Model name
            formData.append("source", "users-permissions"); // Plugin name
            formData.append("field", "avatar"); // Field name in the User mod

            // save it
            this.save(formData);
        }
    }
}
</script>

<style>
.input-file {
    display: none;
}

.ui.progress.attached, .ui.progress.attached .bar {
    height: .25rem;
}

.ui.progress.attached {
    margin-top: -4px;
}

</style>
