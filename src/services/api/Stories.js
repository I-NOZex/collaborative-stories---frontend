import axios from "axios";
import secrets from "@/secrets.json";

export default {
    getStoryDefinition(_id) {
        return axios({
            url: `${secrets.API_URL}/graphql`,
            method: "post",
            data: {
                query: `
                    query {
                        storydefinition(id: "${_id}") {
                            _id
                            title
                            likes {
                                _id
                            }                            
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
                            user {
                                username
                            }
                        }
                    }
                `
            }
        });
    },

    getStoryDefinitions(_filter) {
        _filter = _filter ? `(${_filter})` : "";
        return axios({
            url: `${secrets.API_URL}/graphql`,
            method: "post",
            data: {
                query: `
                    query {
                        storydefinitions ${_filter}  {
                            _id
                            title
                            createdAt
                            likes {
                                _id
                            }
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
        _filter = _filter ? `(${_filter})` : "";
        return axios({
            url: `${secrets.API_URL}/graphql`,
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

    createStorySequence(_payload) {
        return axios({
            url: `${secrets.API_URL}/storyblock`,
            method: "post",
            timeout: 5000,
            data: _payload
        });
    },

    updateStoryDefinitionLikes(_id, _payload){
        return axios({
            url: `${secrets.API_URL}/storydefinition/${_id}`,
            method: "put",
            timeout: 5000,
            data: _payload
        });
    }

};