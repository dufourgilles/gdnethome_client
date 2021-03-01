import * as types from './ActionTypes';
import Api from '../utils/api';

const CONDITION_BASE_URI = '/condition';

/* FETCH */

let lastConditionsFetch;
export const fetchConditions = () => (dispatch, getstate) => {
    return getstate().conditions.isFetching ? lastConditionsFetch : _fetchConditions(dispatch);
};

const _fetchConditions = dispatch => {
    dispatch({type: types.FETCH_CONDITIONS_PENDING});
    lastConditionsFetch = Api.get(CONDITION_BASE_URI)
        .then(
            response => dispatch({type: types.FETCH_CONDITIONS_SUCCESS, conditions: response}),
            error => {
                dispatch({type: types.FETCH_CONDITIONS_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
    return lastConditionsFetch;
};


export const fetchConditionTypes = () => {
    return Api.get(`${CONDITION_BASE_URI}/types`);
};


/* CREATE */


export const createNewCondition = dispatch => condition => {
    dispatch({type: types.ADD_CONDITION_PENDING});
    return Api.post(CONDITION_BASE_URI, condition)
        .then(
            () => _fetchConditions(dispatch),
            error => {
                dispatch({type: types.ADD_CONDITION_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};

export const createNewConditionFromString = dispatch => (name, stringCondition) => {
    dispatch({type: types.ADD_CONDITION_PENDING});
    return Api.post(`${CONDITION_BASE_URI}/string/${name}`, stringCondition)
        .then(
            () => _fetchConditions(dispatch),
            error => {
                dispatch({type: types.ADD_CONDITION_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};

/* UPDATE */

export const updateCondition =  dispatch => condition => {
    dispatch({type: types.UPDATE_CONDITION_PENDING});
    return Api.put(`${CONDITION_BASE_URI}/{id}`, {id: condition.id}, condition)
        .then(
            () => _fetchConditions(dispatch),
            error => {
                dispatch({type: types.UPDATE_CONDITION_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};


/* DELETE */

export const deleteCondition = dispatch => condition => {
    dispatch({type: types.DELETE_CONDITION_PENDING});
    return Api.delete(`${CONDITION_BASE_URI}/{id}`, {id: condition.id})
        .then(
            () => _fetchConditions(dispatch),
            error => {
                dispatch({type: types.DELETE_CONDITION_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};