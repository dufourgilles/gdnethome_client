import Api from '../utils/api';

const CONFIG_BASE_URI = '/status';


export const fetchStatus = () => {
    return Api.get(`${CONFIG_BASE_URI}/`);
};

export const getLogFilePath = () => {
    return `${window.Config.serverURL}/status/logs`;
}

export const getLogTail = (len) => {
    return Api.get(`${CONFIG_BASE_URI}/tail/${len}`);
}