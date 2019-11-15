import Axios from 'axios';
import UriTemplate from 'uri-template';

let Config = window.Config || { serverURL: "" };

class Api {
    static getURL(url, templateValues = {}) {
        const parsedURL =  UriTemplate.parse(url);
        return parsedURL.expand(Object.assign({}, templateValues));
    }

    static get(resourceApi, templatedValues) {
        return Axios.get(Api.getURL(Config.serverURL + resourceApi, templatedValues))
            .then(response => response.data);
    }

    static postFullResponse(resourceApi, data, options=null) {
        return Axios.post(Api.getURL(Config.serverURL + resourceApi), data, options);
    }

    static post(resourceApi, data, options=null) {
        return this.postFullResponse(resourceApi, data, options)
            .then(response => response.data);
    }

    static postWithFetch(resourceApi, data) {
        return Axios.post(Api.getURL(Config.serverURL + resourceApi), data)
            .then(response => {
                if (response.headers.location != null) {
                    return Axios.get(response.headers.location).then(response => response.data);
                }
                return Promise.resolve(response.data);
            });
    }


    static put(resourceApi, templatedValues, data) {
        return Axios.put(Api.getURL(Config.serverURL + resourceApi, templatedValues), data)
            .then(response => response.data);
    }

    static putWithFetch(resourceApi, templatedValues, data) {
        const url = Api.getURL(Config.serverURL + resourceApi, templatedValues);
        return Axios.put(url, data)
            .then(response => {
                return Axios.get(url).then(response => response.data);
            });
    }

    static delete(resourceApi, templatedValues) {
        return Axios.delete(Api.getURL(Config.serverURL + resourceApi, templatedValues))
            .then(response => response.data);
    }
}

export default Api;