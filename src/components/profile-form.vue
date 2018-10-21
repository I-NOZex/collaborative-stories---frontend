<template>
<sui-segment>
    <sui-grid relaxed="very" stackable vertical-align="middle" centered>
        <sui-grid-column width="four">

            <sui-card>

                <sui-image :src="`${API_URL}${this.profile.avatar.url}` || 'https://semantic-ui-vue.github.io/static/images/avatar/large/steve.jpg'"/>
                <sui-button attached="bottom"  @click="$refs.filePicker.click()">
                    <sui-icon name="upload" /> Select image...
                </sui-button>
                <sui-progress color="green" attached bottom percent="56" />
            </sui-card>

            <form novalidate>
            <input type="file" ref="filePicker"  @change="filesChange($event.target.files)"
            accept="image/*" class="input-file">
            </form>

        </sui-grid-column>

        <sui-grid-column width="six">
            <sui-form>
                <sui-form-field v-for="(fieldData, fieldKey) in profileModel.fields" :key="fieldKey" v-bind:error="!fieldData.isValid">
                    <sui-input :type="fieldData.type" :placeholder="fieldData.placeholder" :icon="fieldData.icon" icon-position="left" v-model="fieldData.value" />
                    <sui-label basic color="red" pointing="left" v-if="!fieldData.isValid"> {{fieldData.errorMsg}} </sui-label>
                </sui-form-field>
            </sui-form>
        </sui-grid-column>

        <sui-grid-column width="sixteen" textAlign="center">
            <sui-button-group size="big">
                <!-- <input type="reset" is="sui-button" value="Cancel">
                <sui-button-or /> -->
                <sui-button positive icon="save">Save</sui-button>
            </sui-button-group>
        </sui-grid-column>

    </sui-grid>
</sui-segment>
</template>

<script>
import Vue from "vue";
import _ from "lodash";
import {upload} from "@/services/api/Upload";
import secrets from "@/secrets.json";
import { USER_REQUEST } from "@/store/actions/user";


const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

export default {
    name: 'profileForm',
    data() {
        return {
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
                        placeholder: 'New Password',
                        icon: 'lock',
                        value: '',
                        validationRules: ['required', ],
                        isValid: true,
                        errorMsg: ''
                    },
                    repeatPassword: {
                        type: 'password',
                        placeholder: 'Repeat New Password',
                        icon: 'lock',
                        value: '',
                        validationRules: ['required', '=password'], //FIXME: review the other possible approach `['=', 'repeatPassword']` 
                        isValid: true,
                        errorMsg: ''
                    },
                }
            },
            uploadError: null,
            currentStatus: null,   
            API_URL: secrets.API_URL         
        }
    },
    computed:{
        profile(){
            return this.$store.getters.getProfile
        }
    },
    created(){
        this.profileModel.fields.username.value = this.profile.username;
        this.profileModel.fields.email.value = this.profile.email;

    },
    methods: {
      save(formData) {
        // upload data to the server
        this.currentStatus = STATUS_SAVING;

/*


*/

        upload(formData)
          .then(response => {
              console.log(response)

             const photo =  _.first(response.data);
             this.$store.dispatch(USER_REQUEST);
            //this.uploadedFiles = [].concat(x);
            //this.currentStatus = STATUS_SUCCESS;
          })
          .catch(err => {
            this.uploadError = err.response;
            this.currentStatus = STATUS_FAILED;
          });
      },
      filesChange(fileList) {
          // handle file changes
        var formData = new FormData();
        if (!fileList.length) return;

        const fileData = _.first(fileList);
        // append the files to FormData

        formData.append("files", fileData, fileData.name);// Buffer or stream of file(s)
        formData.append("path", "user/avatar"); // Uploading folder of file(s)
        formData.append("refId", this.profile._id); // User's Id
        formData.append("ref", "user",); // Model name
        formData.append("source", "users-permissions"); // Plugin name
        formData.append("field", "avatar"); // Field name in the User mod

        // save it
        this.save(formData);
      }        
    }
}
</script>

<style>
.input-file{
    display: none;
}
</style>
