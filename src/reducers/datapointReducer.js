import { createSelector } from 'reselect';
import { keyBy } from 'lodash';
import {
    FETCH_DATAPOINTS_PENDING,
    FETCH_DATAPOINTS_FAILURE,
    FETCH_DATAPOINTS_SUCCESS,
    UPDATE_DATAPOINT_PENDING,
    UPDATE_DATAPOINT_FAILURE,
    UPDATE_DATAPOINT_SUCCESS,
    DELETE_DATAPOINT_PENDING,
    DELETE_DATAPOINT_FAILURE,
    DELETE_DATAPOINT_SUCCESS,
    FETCH_DPTYPES_SUCCESS
} from '../actions/ActionTypes';

import { createReducer } from "../utils/reduxHelper";

const initialState = { isFetching: false, items: [], error: null, types: [] };

const genericDatapointPending = state => ({ ...state, isFetching: true, error: null });

const genericDatapointSuccess = (state, action) => ({ ...state, isFetching: false, items: action.datapoints });

const genericDatapointFailure = (state, action) => ({ ...state, isFetching: false, error: action.error });

export const datapointReducer = createReducer(initialState, {
    [FETCH_DATAPOINTS_PENDING]: genericDatapointPending,
    [FETCH_DATAPOINTS_FAILURE]: genericDatapointFailure,
    [FETCH_DATAPOINTS_SUCCESS]: genericDatapointSuccess,
    [UPDATE_DATAPOINT_PENDING]: genericDatapointPending,
    [UPDATE_DATAPOINT_FAILURE]: genericDatapointFailure,
    [UPDATE_DATAPOINT_SUCCESS]: genericDatapointSuccess,
    [DELETE_DATAPOINT_PENDING]: genericDatapointPending,
    [DELETE_DATAPOINT_FAILURE]: genericDatapointFailure,
    [DELETE_DATAPOINT_SUCCESS]: genericDatapointSuccess,
    [FETCH_DPTYPES_SUCCESS]: (state, action) => ({ ...state, types: action.dptypes })
});

/* SELECTORS */

export const getDatapointIndexedByName = createSelector(
    state => state.datapoints.items,
    datapoints => keyBy(datapoints, "id")
);

/* HELPERS */
/**
 * @param {object} state
 * @return {function(id: string): Datapoint}
 */
export const getDatapointByID = state => id => getDatapointIndexedByName(state)[id];

export const EMPTY_DATAPOINT = {
    name: "",
    id: "",
    description: "",
    knxName: "",
    knxGroupName: "",
    type: "",
    actions: [],
    statusReaderID: null
};
