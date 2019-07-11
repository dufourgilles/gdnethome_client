import { APP_IS_FETCHING, APP_IS_READY, APP_NOT_READY } from '../actions/ActionTypes';
import { createReducer } from "../utils/reduxHelper";

/* REDUCERS */

export const initialState = {
    isFetching: false,
    isReady: false
};

const fetchSystemPending = state => ({ ...state, isFetching: true });

const fetchSystemSuccess = state => ({
    ...state,
    isFetching: false,
    isReady: true
});


const fetchSystemFailure = (state) => ({
    ...state,
    isFetching: false,
    isReady: false
});

export const systemReducer = createReducer(initialState, {
    [APP_IS_FETCHING]: fetchSystemPending,
    [APP_IS_READY]: fetchSystemSuccess,
    [APP_NOT_READY]: fetchSystemFailure
});

