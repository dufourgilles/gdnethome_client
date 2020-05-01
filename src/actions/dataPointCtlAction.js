import * as types from './ActionTypes';
import Api from '../utils/api';

const DATAPOINT_BASE_URI = '/datapoint';

/* FETCH */

let lastDataPointCtlsFetch;
export const fetchDataPointCtls = () => (dispatch, getstate) =>
    getstate().datapointctls.isFetching ? lastDataPointCtlsFetch : _fetchDataPointCtls(dispatch);

const _fetchDataPointCtls = dispatch => {
    dispatch({type: types.FETCH_DATAPOINTCTLS_PENDING});
    lastDataPointCtlsFetch = Api.get(DATAPOINT_BASE_URI + "/controllers")
        .then(
            response => dispatch({type: types.FETCH_DATAPOINTCTLS_SUCCESS, datapointctls: response}),
            error => {
                dispatch({type: types.FETCH_DATAPOINTCTLS_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
    return lastDataPointCtlsFetch;
};

export const fetchDPCTLTypes = () => {
    return Api.get(`${DATAPOINT_BASE_URI}/ctltypes`);
};

/* CREATE */


export const createNewDataPointCtl = dispatch => dataPointCtl => {
    dispatch({type: types.ADD_DATAPOINTCTL_PENDING});
    return Api.post(DATAPOINT_BASE_URI + "/controller", dataPointCtl)
        .then(
            () => _fetchDataPointCtls(dispatch),
            error => {
                dispatch({type: types.ADD_DATAPOINTCTL_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};

/* UPDATE */

export const updateDataPointCtl =  dispatch => dataPointCtl => {
    dispatch({type: types.UPDATE_DATAPOINTCTL_PENDING});
    return Api.put(`${DATAPOINT_BASE_URI}/controller/{id}`, {id: dataPointCtl.id}, dataPointCtl)
        .then(
            () => _fetchDataPointCtls(dispatch),
            error => {
                dispatch({type: types.UPDATE_DATAPOINTCTL_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};


/* DELETE */

export const deleteDataPointCtl = dispatch => datapoint => {
    dispatch({type: types.DELETE_DATAPOINTCTL_PENDING});
    return Api.delete(`${DATAPOINT_BASE_URI}/controller/{id}`, {id: datapoint.id})
        .then(
            () => _fetchDataPointCtls(dispatch),
            error => {
                dispatch({type: types.DELETE_DATAPOINTCTL_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};

export const deleteAllDataPointCtls = dispatch => () => {
    dispatch({type: types.DELETE_DATAPOINTCTL_PENDING});
    return Api.delete(`${DATAPOINT_BASE_URI}/controller/all`)
        .then(
            () => _fetchDataPointCtls(dispatch),
            error => {
                dispatch({type: types.DELETE_DATAPOINTCTL_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};

/* EXECUTE */

export const executeAction = dispatch => (dataPointCtlId, action, parameter) => {
    dispatch({type: types.EXECUTEACTION_DATAPOINTCTL_PENDING});
    return Api.post(`${DATAPOINT_BASE_URI}/controller/${dataPointCtlId}/action/${action}`, parameter)
        .then(
            () => _fetchDataPointCtls(dispatch),
            error => {
                dispatch({type: types.EXECUTEACTION_DATAPOINTCTL_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};
