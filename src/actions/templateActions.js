import * as types from './ActionTypes';
import Api from '../utils/api';

const TEMPLATE_BASE_URI = '/template';

/* FETCH */

let templatesFetchPromise;
export const fetchTemplates = () => (dispatch, getstate) => {
    return getstate().templates.isFetching ? templatesFetchPromise : _fetchTemplates(dispatch);
};

const _fetchTemplates = dispatch => {
    dispatch({type: types.FETCH_TEMPLATES_PENDING});
    templatesFetchPromise = Api.get(TEMPLATE_BASE_URI)
        .then(
            response => dispatch({type: types.FETCH_TEMPLATES_SUCCESS, actions: response}),
            error => {
                dispatch({type: types.FETCH_TEMPLATES_FAILURE, error: error.message});
                return Promise.reject(error);
            }
        );
    return templatesFetchPromise;
};

