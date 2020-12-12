
import {
    FETCH_REPLAYDATA_FAILURE,
    FETCH_REPLAYDATA_PENDING,
    FETCH_REPLAYDATA_SUCCESS,
    FETCH_REPLAYFILES_FAILURE,
    FETCH_REPLAYFILES_PENDING,
    FETCH_REPLAYFILES_SUCCESS,
    UPDATE_REPLAYDATA_PENDING,
    UPDATE_REPLAYDATA_FAILURE,
    UPDATE_REPLAYDATA_SUCCESS
} from '../actions/ActionTypes';

import { createReducer } from "../utils/reduxHelper";

const initialState = { isFetching: false, info: {}, error: null, replayFiles: [] };

const goPending = state => ({ ...state, isFetching: true, error: null });

const replayDataSuccess = (state, replayData) => ({ ...state, isFetching: false, info:  replayData.data});
const replayfilesSuccess = (state, replayFiles) => ({ ...state, isFetching: false, replayFiles:  replayFiles.data});
const goSuccess = (state, action) => ({ ...state, isFetching: false});
const goFailure = (state, action) => ({ ...state, isFetching: false, error: action.error });

export const replayDataReducer = createReducer(initialState, {
    [FETCH_REPLAYDATA_PENDING]: goPending,
    [FETCH_REPLAYDATA_FAILURE]: goFailure,
    [FETCH_REPLAYDATA_SUCCESS]: replayDataSuccess,
    [FETCH_REPLAYFILES_PENDING]: goPending,
    [FETCH_REPLAYFILES_FAILURE]: goFailure,
    [FETCH_REPLAYFILES_SUCCESS]: replayfilesSuccess,
    [UPDATE_REPLAYDATA_PENDING]: goPending,
    [UPDATE_REPLAYDATA_FAILURE]: goFailure,
    [UPDATE_REPLAYDATA_SUCCESS]: goSuccess,
});
