import { createSelector } from 'reselect';
import { keyBy } from 'lodash';
import {
    FETCH_DATAPOINTCTLS_PENDING,
    FETCH_DATAPOINTCTLS_FAILURE,
    FETCH_DATAPOINTCTLS_SUCCESS,
    UPDATE_DATAPOINTCTL_PENDING,
    UPDATE_DATAPOINTCTL_FAILURE,
    UPDATE_DATAPOINTCTL_SUCCESS,
    DELETE_DATAPOINTCTL_PENDING,
    DELETE_DATAPOINTCTL_FAILURE,
    DELETE_DATAPOINTCTL_SUCCESS,
    EXECUTEACTION_DATAPOINTCTL_PENDING,
    EXECUTEACTION_DATAPOINTCTL_FAILURE,
    FETCH_DPTYPES_SUCCESS
} from '../actions/ActionTypes';

import { createReducer } from "../utils/reduxHelper";

const initialState = { isFetching: false, items: [], error: null, types: [] };

const genericDataPointCtlPending = state => ({ ...state, isFetching: true, error: null });

const genericDataPointCtlSuccess = (state, action) => ({ ...state, isFetching: false, items: action.datapointctls });

const genericDataPointCtlFailure = (state, action) => ({ ...state, isFetching: false, error: action.error });

export const dataPointCtlReducer = createReducer(initialState, {
    [FETCH_DATAPOINTCTLS_PENDING]: genericDataPointCtlPending,
    [FETCH_DATAPOINTCTLS_FAILURE]: genericDataPointCtlFailure,
    [FETCH_DATAPOINTCTLS_SUCCESS]: genericDataPointCtlSuccess,
    [UPDATE_DATAPOINTCTL_PENDING]: genericDataPointCtlPending,
    [UPDATE_DATAPOINTCTL_FAILURE]: genericDataPointCtlFailure,
    [UPDATE_DATAPOINTCTL_SUCCESS]: genericDataPointCtlSuccess,
    [DELETE_DATAPOINTCTL_PENDING]: genericDataPointCtlPending,
    [DELETE_DATAPOINTCTL_FAILURE]: genericDataPointCtlFailure,
    [DELETE_DATAPOINTCTL_SUCCESS]: genericDataPointCtlSuccess,
    [EXECUTEACTION_DATAPOINTCTL_PENDING]: genericDataPointCtlPending,
    [EXECUTEACTION_DATAPOINTCTL_FAILURE]: genericDataPointCtlFailure,
    [FETCH_DPTYPES_SUCCESS]: (state, action) => ({ ...state, types: action.dptypes })
});

/* SELECTORS */

export const getDataPointCtlIndexedByName = createSelector(
    state => state.datapointctls.items,
    datapointctls => keyBy(datapointctls, "id")
);

/* HELPERS */
/**
 * @param {object} state
 * @return {function(id: string): DataPointCtl}
 */
export const getDataPointCtlByID = state => {
    const table = getDataPointCtlIndexedByName(state);
    return id => {
        return table[id];
    };
};

export const EMPTY_DATAPOINTCTL = {
    name: "",
    id: "",
    type: "SwitchCtl",
    actions: [],
    statusReaderID: null,
    commandWriterID: null
};
