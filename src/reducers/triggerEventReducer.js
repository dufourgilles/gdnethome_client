import { createSelector } from 'reselect';
import { keyBy } from 'lodash';
import {
    FETCH_TRIGGERS_FAILURE,
    FETCH_TRIGGERS_PENDING,
    FETCH_TRIGGERS_SUCCESS
} from '../actions/ActionTypes';

import { createReducer } from "../utils/reduxHelper";

const initialState = { isFetching: false, items: [], error: null, types: [] };

const genericTriggerPending = state => ({ ...state, isFetching: true, error: null });

const genericTriggerSuccess = (state, action) => ({ ...state, isFetching: false, items: [{id: "none"}].concat(action.triggers) });

const genericTriggerFailure = (state, action) => ({ ...state, isFetching: false, error: action.error });

export const triggerReducer = createReducer(initialState, {
    [FETCH_TRIGGERS_PENDING]: genericTriggerPending,
    [FETCH_TRIGGERS_FAILURE]: genericTriggerFailure,
    [FETCH_TRIGGERS_SUCCESS]: genericTriggerSuccess,
});

/* SELECTORS */

export const getTriggerIndexedByName = createSelector(
    state => state.triggers.items,
    triggers => keyBy(triggers, "id")
);

/* HELPERS */
/**
 * @param {object} state
 * @return {function(id: string): TriggerEvent}
 */
export const getTriggerByID = state => id => getTriggerIndexedByName(state)[id];

export const EMPTY_TRIGGER = {
    id: "",
    value: ""
};
