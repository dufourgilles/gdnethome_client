import { createSelector } from 'reselect';
import { keyBy } from 'lodash';
import {
  ADD_GROUP_FAILURE,
  ADD_GROUP_PENDING,
  ADD_GROUP_SUCCESS,
  DELETE_GROUP_FAILURE,
  DELETE_GROUP_PENDING,
  DELETE_GROUP_SUCCESS,
  FETCH_GROUPS_FAILURE,
  FETCH_GROUPS_PENDING,
  FETCH_GROUPS_SUCCESS,
  ADD_GROUP_DATAPOINT_FAILURE,
  ADD_GROUP_DATAPOINT_PENDING,
  ADD_GROUP_DATAPOINT_SUCCESS,
  REMOVE_GROUP_DATAPOINT_FAILURE,
  REMOVE_GROUP_DATAPOINT_PENDING,
  REMOVE_GROUP_DATAPOINT_SUCCESS
} from '../actions/ActionTypes';
import { createReducer } from "../utils/reduxHelper";


const initialState = { isFetching: false, items: [], error: null };

const genericGroupPending = state => ({ ...state, isFetching: true, error: null });

const genericGroupSuccess = (state, action) => ({ ...state, isFetching: false, items: action.groups });

const genericGroupFailure = (state, action) => ({ ...state, isFetching: false, error: action.error });

export const groupReducer = createReducer(initialState, {
  [FETCH_GROUPS_PENDING]: genericGroupPending,
  [FETCH_GROUPS_SUCCESS]: genericGroupSuccess,
  [FETCH_GROUPS_FAILURE]: genericGroupFailure,
  [ADD_GROUP_PENDING]: genericGroupPending,
  [ADD_GROUP_SUCCESS]: genericGroupSuccess,
  [ADD_GROUP_FAILURE]: genericGroupFailure,
  [ADD_GROUP_DATAPOINT_PENDING]: genericGroupPending,
  [ADD_GROUP_DATAPOINT_SUCCESS]: genericGroupSuccess,
  [ADD_GROUP_DATAPOINT_FAILURE]: genericGroupFailure,
  [REMOVE_GROUP_DATAPOINT_PENDING]: genericGroupPending,
  [REMOVE_GROUP_DATAPOINT_SUCCESS]: genericGroupSuccess,
  [REMOVE_GROUP_DATAPOINT_FAILURE]: genericGroupFailure,
  [DELETE_GROUP_PENDING]: state => ({ ...state, isFetching: false }),
  [DELETE_GROUP_SUCCESS]: genericGroupSuccess,
  [DELETE_GROUP_FAILURE]: genericGroupFailure
});

/* SELECTORS */

export const getGroupIndexedByName = createSelector(
    state => state.groups.items,
    groups => keyBy(groups, "name")
);


/* HELPERS */
/**
 * @param {object} state
 * @return {function(groupName: string): Group}
 */
export const getGroupByName = state => groupName => getGroupIndexedByName(state)[groupName];
