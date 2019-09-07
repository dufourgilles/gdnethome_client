import Api from '../utils/api';

const REPLAY_BASE_URI = "/replay"
export const fetchReplayInfo = () => {
    return Api.get(`${REPLAY_BASE_URI}/`);
};

export const updateReplayInfo = replayInfo => {
    return Api.put(`${REPLAY_BASE_URI}/`, null, replayInfo);
};