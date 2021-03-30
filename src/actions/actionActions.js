import * as types from './ActionTypes';
import Api from '../utils/api';

const ACTION_BASE_URI = '/action';

/* FETCH */

let actionsFetchPromise;
export const fetchActions = () => (dispatch, getstate) => {
    return getstate().actions.isFetching ? actionsFetchPromise : _fetchActions(dispatch);
};

export const fetchActionTypes = () => {
    return Api.get(`${ACTION_BASE_URI}/types`);
};

export const fetchActionData = names => {
    const nameList = names.join(",");
    return Api.get(`${ACTION_BASE_URI}/data?info=${nameList}`);
}

export const fetchActionFiles = name => {
    return Api.get(`${ACTION_BASE_URI}/files/${name}`);
}

const _fetchActions = dispatch => {
    dispatch({type: types.FETCH_ACTIONS_PENDING});
    actionsFetchPromise = Api.get(ACTION_BASE_URI)
        .then(
            response => dispatch({type: types.FETCH_ACTIONS_SUCCESS, actions: response}),
            error => {
                dispatch({type: types.FETCH_ACTIONS_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
    return actionsFetchPromise;
};

/* CREATE */


export const createNewAction = dispatch => action => {
    dispatch({type: types.ADD_ACTION_PENDING});
    return Api.post(ACTION_BASE_URI, action)
        .then(
            () => _fetchActions(dispatch),
            error => {
                dispatch({type: types.ADD_ACTION_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};

/* UPDATE */

export const updateAction =  dispatch => action => {
    dispatch({type: types.UPDATE_ACTION_PENDING});
    return Api.put(`${ACTION_BASE_URI}/{id}`, {id: action.id}, action)
        .then(
            () => _fetchActions(dispatch),
            error => {
                dispatch({type: types.UPDATE_ACTION_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};


/* DELETE */

export const deleteAction = dispatch => action => {
    dispatch({type: types.DELETE_ACTION_PENDING});
    return Api.delete(`${ACTION_BASE_URI}/{id}`, {id: action.id})
        .then(
            () => _fetchActions(dispatch),
            error => {
                dispatch({type: types.DELETE_ACTION_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};

export const deleteFullAction = dispatch => action => {
    dispatch({type: types.DELETE_ACTION_PENDING});
    return Api.delete(`${ACTION_BASE_URI}/{id}/full`, {id: action.id})
        .then(
            () => _fetchActions(dispatch),
            error => {
                dispatch({type: types.DELETE_ACTION_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};