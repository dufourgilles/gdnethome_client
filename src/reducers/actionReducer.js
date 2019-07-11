import { createSelector } from 'reselect';
import { keyBy } from 'lodash';
import {
    FETCH_ACTIONS_FAILURE,
    FETCH_ACTIONS_PENDING,
    FETCH_ACTIONS_SUCCESS,
    ADD_ACTION_PENDING,
    ADD_ACTION_FAILURE,
    UPDATE_ACTION_PENDING,
    UPDATE_ACTION_FAILURE,
    DELETE_ACTION_PENDING,
    DELETE_ACTION_FAILURE,

} from '../actions/ActionTypes';

import { createReducer } from "../utils/reduxHelper";

const initialState = { isFetching: false, items: [], error: null, types: [] };

const genericActionPending = state => ({ ...state, isFetching: true, error: null });

const genericActionSuccess = (state, action) => ({ ...state, isFetching: false, items: action.actions });

const genericActionFailure = (state, action) => ({ ...state, isFetching: false, error: action.error });

export const actionReducer = createReducer(initialState, {
    [FETCH_ACTIONS_PENDING]: genericActionPending,
    [FETCH_ACTIONS_FAILURE]: genericActionFailure,
    [FETCH_ACTIONS_SUCCESS]: genericActionSuccess,
    [ADD_ACTION_FAILURE]: genericActionFailure,
    [ADD_ACTION_PENDING]: genericActionSuccess,
    [UPDATE_ACTION_PENDING]: genericActionPending,
    [UPDATE_ACTION_FAILURE]: genericActionFailure,
    [DELETE_ACTION_PENDING]: genericActionPending,
    [DELETE_ACTION_FAILURE]: genericActionFailure
});

/* SELECTORS */

export const getActionIndexedByName = createSelector(
    state => state.actions.items,
    actions => keyBy(actions, "id")
);

/* HELPERS */
/**
 * @param {object} state
 * @return {function(id: string): Action}
 */
export const getActionByID = state => id => getActionIndexedByName(state)[id];

export const EMPTY_ACTION = {
    id: "",
    type: "SaveEventAction",
    parameters: {},
    triggerEventID: "",
    conditionID: ""
};
