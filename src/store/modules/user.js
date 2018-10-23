import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from "../actions/user";
import axios from "axios";
import Vue from "vue";
import { AUTH_LOGOUT } from "../actions/auth";
import secrets from "@/secrets.json";

const state = { status: "", profile: {}, avatarImage: "" };

const getters = {
    getProfile: state => state.profile,
    getAvatarImage: state => state.avatarImage,
    isProfileLoaded: state => !!state.profile.username
};

const actions = {
    [USER_REQUEST]: ({ commit, dispatch }) => {
        commit(USER_REQUEST);

        axios({
            url: `${secrets.API_URL}/user/me`,
            method: "get",
            timeout: 5000
        })
        .then(resp => {
            commit(USER_SUCCESS, resp);
        })
        .catch(resp => {
            commit(USER_ERROR);
            // if resp is unauthorized, logout, to
            dispatch(AUTH_LOGOUT);
        });
    }
};

const mutations = {
    [USER_REQUEST]: state => {
        state.status = "loading";
    },
    [USER_SUCCESS]: (state, resp) => {
        state.status = "success";
        Vue.set(state, "profile", resp.data);
        //FIXME: APPEND A «absoluteUrl» property to «profile.avatar» object
        Vue.set(state, "avatarImage", secrets.API_URL + resp.data.avatar.url);
    },
    [USER_ERROR]: state => {
        state.status = "error";
    },
    [AUTH_LOGOUT]: state => {
        state.profile = {};
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
