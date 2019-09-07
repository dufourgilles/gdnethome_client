import { createSelector } from 'reselect';
import { keyBy } from 'lodash';
import {
    FETCH_CONDITIONS_FAILURE,
    FETCH_CONDITIONS_PENDING,
    FETCH_CONDITIONS_SUCCESS,
    ADD_CONDITION_PENDING,
    ADD_CONDITION_FAILURE,
    UPDATE_CONDITION_PENDING,
    UPDATE_CONDITION_FAILURE,
    DELETE_CONDITION_PENDING,
    DELETE_CONDITION_FAILURE,

} from '../actions/ActionTypes';

import { createReducer } from "../utils/reduxHelper";

const initialState = { isFetching: false, items: [], error: null, types: [] };

const genericConditionPending = state => ({ ...state, isFetching: true, error: null });

const genericConditionSuccess = (state, action) => (
    { ...state, isFetching: false, 
        items: action.conditions == null ? [{id: "none"}] : [{id: "none"}].concat(action.conditions) 
    });

const genericConditionFailure = (state, action) => ({ ...state, isFetching: false, error: action.error });

export const conditionReducer = createReducer(initialState, {
    [FETCH_CONDITIONS_PENDING]: genericConditionPending,
    [FETCH_CONDITIONS_FAILURE]: genericConditionFailure,
    [FETCH_CONDITIONS_SUCCESS]: genericConditionSuccess,
    [ADD_CONDITION_FAILURE]: genericConditionFailure,
    [ADD_CONDITION_PENDING]: genericConditionSuccess,
    [UPDATE_CONDITION_PENDING]: genericConditionPending,
    [UPDATE_CONDITION_FAILURE]: genericConditionFailure,
    [DELETE_CONDITION_PENDING]: genericConditionPending,
    [DELETE_CONDITION_FAILURE]: genericConditionFailure
});

/* SELECTORS */

export const getConditionIndexedByName = createSelector(
    state => state.conditions.items,
    conditions => keyBy(conditions, "id")
);

/* HELPERS */
/**
 * @param {object} state
 * @return {function(id: string): Condition}
 */
export const getConditionByID = state => id => getConditionIndexedByName(state)[id];

export const EMPTY_CONDITION = {
    id: "",
    operator: "EQUAL",
    conditionIDs: [],
    triggerValue: 0,
    triggerEventID: ""
};
