import axios from "axios";
import secrets from "@/secrets.json";


export default {
    updateUser(_id, _payload){
        console.log('abc')
        return axios({
            url: `${secrets.API_URL}/user/${_id}`,
            method: "put",
            timeout: 5000,
            data: _payload
        });        
    }
}