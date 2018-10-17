import axios from "axios";
import secrets from "@/secrets.json";
import { isArray } from "util";

export default {
    getStoryDefinition(_id) {
        return axios({
            url: `${secrets.api_address}/graphql`,
            method: "post",
            data: {
                query: `
                    query {
                        storydefinition(id: "${_id}") {
                            _id
                            title
                            likes
                            createdAt
                            user {
                                username
                            }
                        }

                        storyblocks(where: {storydefinition:"${_id}"}, sort: "order") {
                            _id
                            storyBody
                            createdAt
                            order
                            likes
                            user {
                                username
                            }
                        }
                    }
                `
            }
        });
    },

    getStoryDefinitions(_filter){
        _filter = _filter ? `(${_filter})` : '';
        return axios({
            url: `${secrets.api_address}/graphql`,
            method: "post",
            data: {
                query: `
                    query {
                        storydefinitions ${_filter}  {
                            _id
                            title
                            createdAt
                            likes
                            user {
                                username
                            }
                            storyblocks (sort: "order:asc", limit: 1) {
                                storyBody
                                order
                                _id
                            }
                        }
                    }
                `
            }
        });    
    },

    getStoryDefinitionsCount(_filter) {
        _filter = _filter ? `(${_filter})` : '';
        return axios({
            url: `${secrets.api_address}/graphql`,
            method: "post",
            data: {
                query: `
                    query {
                        storydefinitions ${_filter} {
                            _id
                            storyblocks {
                                _id
                            }
                        }
                    }
                `
            }
        });
    },

    createStorySequence(payload){
        return axios({
            url: `${secrets.api_address}/storyblock`,
            method: "post",
            timeout: 5000,
            data: data
        });
    }
}