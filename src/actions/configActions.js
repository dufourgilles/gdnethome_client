import Api from '../utils/api';

const CONFIG_BASE_URI = '/config';


export const fetchConfig = () => {
    return Api.get(`${CONFIG_BASE_URI}/`);
};

export const updateConfig = config => {
    return Api.put(`${CONFIG_BASE_URI}/`, {}, config);
}

export const updateInterface = (name,interfaceConfig) => {
    return Api.put(`${CONFIG_BASE_URI}/files/{name}`, {name}, interfaceConfig);
}
