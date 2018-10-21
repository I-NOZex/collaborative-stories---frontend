import axios from "axios";
import secrets from "@/secrets.json";

function upload(_payload) {
    return axios.post(`${secrets.API_URL}/upload`, _payload);
    // // get data
    // .then(x => x.data)
    // // add url field
    // .then(x => x.map(img => Object.assign({},
    //     img, { url: `${BASE_URL}/images/${img.id}` })));
}

export {upload}