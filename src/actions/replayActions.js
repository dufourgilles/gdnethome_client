import Api from '../utils/api';
import * as types from './ActionTypes';

const REPLAY_BASE_URI = "/replay"
const internalFetchReplayInfo = () => {
    return Api.get(`${REPLAY_BASE_URI}/`);
};

const internalFetchReplayFiles = () => {
    return Api.get(`${REPLAY_BASE_URI}/files`).then(files => (files.map(f => ({id: f}))));
};

export const updateReplayInfo = replayInfo => {
    return Api.put(`${REPLAY_BASE_URI}/`, null, replayInfo);
};

export const getReplayFile = filename => {
    return Api.get(`${REPLAY_BASE_URI}/file/${filename}`);
};

/* FETCH */

let lastReplayDataFetch;
export const fetchReplayData = () => (dispatch, getstate) => {
    const state = getstate();
    return getstate().replaydata.isFetching ? lastReplayDataFetch : _fetchReplayData(dispatch);
};

const _fetchReplayData = dispatch => {
    dispatch({type: types.FETCH_REPLAYDATA_PENDING});
    lastReplayDataFetch = internalFetchReplayInfo()
        .then(
            response => dispatch({type: types.FETCH_REPLAYDATA_SUCCESS, data: response}),
            error => {
                dispatch({type: types.FETCH_REPLAYDATA_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
    return lastReplayDataFetch;
};

let lastReplayFilesFetch;
export const fetchReplayFiles = () => (dispatch, getstate) => {
    const state = getstate();
    return getstate().replaydata.isFetching ? lastReplayFilesFetch : _fetchReplayFiles(dispatch);
};

const _fetchReplayFiles = dispatch => {
    dispatch({type: types.FETCH_REPLAYFILES_PENDING});
    lastReplayFilesFetch = internalFetchReplayFiles()
        .then(
            response => dispatch({type: types.FETCH_REPLAYFILES_SUCCESS, data: response}),
            error => {
                dispatch({type: types.FETCH_REPLAYFILES_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
    return lastReplayFilesFetch;
};