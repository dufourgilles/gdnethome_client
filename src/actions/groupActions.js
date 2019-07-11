import * as types from './ActionTypes';
import Api from '../utils/api';

const GROUP_BASE_URI = '/group';

/* FETCH */

let lastGroupsFetch;
export const fetchGroups = () => (dispatch, getstate) => {
    return getstate().groups.isFetching ? lastGroupsFetch : _fetchGroups(dispatch);
};

const _fetchGroups = dispatch => {
  dispatch({type: types.FETCH_GROUPS_PENDING});
  lastGroupsFetch = Api.get(GROUP_BASE_URI)
    .then(
      response => dispatch({type: types.FETCH_GROUPS_SUCCESS, groups: response}),
      error => {
          dispatch({type: types.FETCH_GROUPS_FAILURE, error: error.message});
          return Promise.reject(error);
      }
    );
  return lastGroupsFetch;
};

/* CREATE */


export const createNewGroup = group => dispatch => {
  dispatch({type: types.ADD_GROUP_PENDING});
  return Api.post(GROUP_BASE_URI, group)
    .then(
      response => dispatch({type: types.ADD_GROUP_SUCCESS, groups: response}),
      error => dispatch({type: types.ADD_GROUP_FAILURE, error: error.message})
    );
};

/* UPDATE */

export const addEndpoint = (groupName, endpointID) => dispatch => {
  dispatch({type: types.ADD_GROUP_DATAPOINT_PENDING});
  return Api.put(`${GROUP_BASE_URI}/{name}/{id}`, {name: groupName, id: endpointID})
    .then(
        () => _fetchGroups(dispatch),
        error => dispatch({type: types.ADD_GROUP_DATAPOINT_FAILURE, error: error.message})
    );
};

export const removendpoint = (groupName, endpointID) => dispatch => {
    dispatch({type: types.REMOVE_GROUP_DATAPOINT_PENDING});
    return Api.delete(`${GROUP_BASE_URI}/{name}/{id}`, {name: groupName, id: endpointID})
        .then(
            () => _fetchGroups(dispatch),
            error => dispatch({type: types.REMOVE_GROUP_DATAPOINT_FAILURE, error: error.message})
        );
};

/* DELETE */

export const deleteGroup = group => dispatch => {
  dispatch({type: types.DELETE_GROUP_PENDING});
  return Api.delete(`${GROUP_BASE_URI}/{id}`, {id: group.id})
    .then(
        () => _fetchGroups(dispatch),
      error => dispatch({type: types.DELETE_GROUP_FAILURE, error: error.message})
    );
};


