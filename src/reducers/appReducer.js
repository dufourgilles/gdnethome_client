import {createReducer} from "../utils/reduxHelper";
import {APP_IS_READY, APP_NOT_READY} from "../actions/ActionTypes";

/* REDUCERS */
const initialState = {isReady: false, error: null};
const appIsReady = state => ({...state, isReady: true, error: null});
const appNotReady = (state, action) => ({...state, isReady: false, error: action.error});
export const appReducer = createReducer(initialState,{
    [APP_IS_READY]: appIsReady,
    [APP_NOT_READY]: appNotReady
});