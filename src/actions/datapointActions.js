import * as types from './ActionTypes';
import Api from '../utils/api';

const DATAPOINT_BASE_URI = '/datapoint';

/* FETCH */

let lastDatapointsFetch;
export const fetchDatapoints = () => (dispatch, getstate) =>
    getstate().datapoints.isFetching ? lastDatapointsFetch : _fetchDatapoints(dispatch);

const _fetchDatapoints = dispatch => {
    dispatch({type: types.FETCH_DATAPOINTS_PENDING});
    lastDatapointsFetch = Api.get(DATAPOINT_BASE_URI)
        .then(
            response => dispatch({type: types.FETCH_DATAPOINTS_SUCCESS, datapoints: response}),
            error => {
                dispatch({type: types.FETCH_DATAPOINTS_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
    return lastDatapointsFetch;
};


export const fetchDatapointTypes = dispatch => {
    Api.get(`${DATAPOINT_BASE_URI}/types`)
        .then(response => {
            let dptypes = [];
            for(let name in response.names) {
                dptypes.push({name, id: response.names[name]});
            }
            dptypes.sort((a,b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
            return dispatch({type: types.FETCH_DPTYPES_SUCCESS, dptypes})
        });
};

/* CREATE */


export const createNewDatapoint = dispatch => datapoint => {
    dispatch({type: types.ADD_DATAPOINT_PENDING});
    return Api.post(DATAPOINT_BASE_URI, datapoint)
        .then(
            () => _fetchDatapoints(dispatch),
            error => {
                dispatch({type: types.ADD_DATAPOINT_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};

/* UPDATE */

export const updateDatapoint =  dispatch => datapoint => {
    dispatch({type: types.UPDATE_DATAPOINT_PENDING});
    return Api.put(`${DATAPOINT_BASE_URI}/{id}`, {id: datapoint.id}, datapoint)
        .then(
            () => _fetchDatapoints(dispatch),
            error => {
                dispatch({type: types.UPDATE_DATAPOINT_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};


/* DELETE */

export const deleteDatapoint = dispatch => datapoint => {
    dispatch({type: types.DELETE_DATAPOINT_PENDING});
    return Api.delete(`${DATAPOINT_BASE_URI}/{id}`, {id: datapoint.id})
        .then(
            () => _fetchDatapoints(dispatch),
            error => {
                dispatch({type: types.DELETE_DATAPOINT_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};

export const deleteAllDatapoints = dispatch => () => {
    dispatch({type: types.DELETE_DATAPOINT_PENDING});
    return Api.delete(`${DATAPOINT_BASE_URI}/all`)
        .then(
            () => _fetchDatapoints(dispatch),
            error => {
                dispatch({type: types.DELETE_DATAPOINT_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};

export const uploadFile =  dispatch => data => {
    dispatch({type: types.UPLOAD_DATAPOINT_ETS5_PENDING});
    return Api.post(`${DATAPOINT_BASE_URI}/upload`, data, {headers: {'Content-Type': "text/plain"}})
        .then(
            () => _fetchDatapoints(dispatch),
            error => {
                dispatch({type: types.UPLOAD_DATAPOINT_ETS5_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
};

