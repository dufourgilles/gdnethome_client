import { createSelector } from 'reselect';
import { keyBy } from 'lodash';
import {
    FETCH_TEMPLATES_FAILURE,
    FETCH_TEMPLATES_PENDING,
    FETCH_TEMPLATES_SUCCESS
} from '../actions/ActionTypes';

import { createReducer } from "../utils/reduxHelper";

const initialState = { isFetching: false, items: [], error: null, types: [] };

const genericActionPending = state => ({ ...state, isFetching: true, error: null });

const genericActionSuccess = (state, template) => ({ ...state, isFetching: false, items: template.templates });

const genericActionFailure = (state, template) => ({ ...state, isFetching: false, error: template.error });

export const templateReducer = createReducer(initialState, {
    [FETCH_TEMPLATES_PENDING]: genericActionPending,
    [FETCH_TEMPLATES_FAILURE]: genericActionFailure,
    [FETCH_TEMPLATES_SUCCESS]: genericActionSuccess
});

/* SELECTORS */

export const getTemplateIndexedByName = createSelector(
    state => state.templates.items,
    templates => keyBy(templates, "id")
);

/* HELPERS */
/**
 * @param {object} state
 * @return {function(id: string): Action}
 */
export const getTemplateByID = state => id => getTemplateIndexedByName(state)[id];
