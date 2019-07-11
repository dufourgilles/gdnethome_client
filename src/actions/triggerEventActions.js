import * as types from './ActionTypes';
import Api from '../utils/api';

const TRIGGER_BASE_URI = '/trigger';

/* FETCH */

let lastTriggersFetch;
export const fetchTriggers = () => (dispatch, getstate) => {
    return getstate().triggers.isFetching ? lastTriggersFetch : _fetchTriggers(dispatch);
};

const _fetchTriggers = dispatch => {
    dispatch({type: types.FETCH_TRIGGERS_PENDING});
    lastTriggersFetch = Api.get(TRIGGER_BASE_URI)
        .then(
            response => dispatch({type: types.FETCH_TRIGGERS_SUCCESS, triggers: response}),
            error => {
                dispatch({type: types.FETCH_TRIGGERS_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
    return lastTriggersFetch;
};



