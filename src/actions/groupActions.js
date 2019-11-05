import * as types from './ActionTypes';
import Api from '../utils/api';
import {getDatapointByID} from '../reducers/datapointReducer';
import {getDataPointCtlByID} from '../reducers/dataPointCtlReducer';

const GROUP_BASE_URI = '/group';

const expandGroupItems = state =>  {
  const getDPCTL = getDataPointCtlByID(state);
  const getDP = getDatapointByID(state);
  return res => {
    const groups = res.map(group => {
      try {
        if (group.elementType === "DataPoint") {
          group.elements = group.elements.map(elementID => getDP(elementID));
        }
        else if (group.elementType === "DataPointCtl") {
          const elements = group.elements.map(elementID => {
            const dpctl = getDPCTL(elementID);
            return dpctl;
          });
          group.elements = elements;
        }
      }
      catch(e) {
        console.log(e)
      }
      return group;
    });
    return groups;
  };
};


/* FETCH */
let getItems;
let lastGroupsFetch;
export const fetchGroups = () => (dispatch, getstate) => {
  const state = getstate();
  getItems = expandGroupItems(state);
  return state.groups.isFetching ? lastGroupsFetch : _fetchGroups(dispatch);
};

const _fetchGroups = dispatch => {  
  dispatch({type: types.FETCH_GROUPS_PENDING});
  lastGroupsFetch = Api.get(GROUP_BASE_URI)
    .then( response => {
        return dispatch({type: types.FETCH_GROUPS_SUCCESS, groups: getItems(response)})
    })
    .catch(error => {
        dispatch({type: types.FETCH_GROUPS_FAILURE, error: error.message});
        return Promise.reject(error);
    });
  return lastGroupsFetch;
};

/* CREATE */


export const createNewGroup = dispatch => group =>  {
  dispatch({type: types.ADD_GROUP_PENDING});
  return Api.post(GROUP_BASE_URI, group)
    .then(
      response => dispatch({type: types.ADD_GROUP_SUCCESS, groups: response}),
      error => dispatch({type: types.ADD_GROUP_FAILURE, error: error.message})
    );
};

/* UPDATE */

export const addEndpoint = dispatch => (groupName, endpointID) =>  {
  dispatch({type: types.ADD_GROUP_DATAPOINT_PENDING});
  return Api.put(`${GROUP_BASE_URI}/{name}/{id}`, {name: groupName, id: endpointID})
    .then(
        () => _fetchGroups(dispatch),
        error => dispatch({type: types.ADD_GROUP_DATAPOINT_FAILURE, error: error.message})
    );
};

export const removendpoint = dispatch => (groupName, endpointID) =>  {
    dispatch({type: types.REMOVE_GROUP_DATAPOINT_PENDING});
    return Api.delete(`${GROUP_BASE_URI}/{name}/{id}`, {name: groupName, id: endpointID})
        .then(
            () => _fetchGroups(dispatch),
            error => dispatch({type: types.REMOVE_GROUP_DATAPOINT_FAILURE, error: error.message})
        );
};

/* DELETE */

export const deleteGroup = dispatch => group =>  {
  dispatch({type: types.DELETE_GROUP_PENDING});
  return Api.delete(`${GROUP_BASE_URI}/{id}`, {id: group.id})
    .then(
        () => _fetchGroups(dispatch),
      error => dispatch({type: types.DELETE_GROUP_FAILURE, error: error.message})
    );
};


