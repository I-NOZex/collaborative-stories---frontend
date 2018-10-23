import axios from "axios";
import secrets from "@/secrets.json";

function upload(_payload, onProgressCB) {
    return axios.post(`${secrets.API_URL}/upload`, _payload, {
        onUploadProgress: function(progressEvent) {
            const percentCompleted = parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
            if (onProgressCB) onProgressCB(percentCompleted);

            return percentCompleted;
        }
    });
    // // get data
    // .then(x => x.data)
    // // add url field
    // .then(x => x.map(img => Object.assign({},
    //     img, { url: `${BASE_URL}/images/${img.id}` })));
}

export {upload}