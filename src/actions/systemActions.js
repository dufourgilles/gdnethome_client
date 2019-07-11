import { fetchGroups } from "./groupActions";
import { fetchDatapoints , fetchDatapointTypes} from "./datapointActions";
import { fetchDataPointCtls } from "./dataPointCtlAction";
import { fetchTriggers } from "./triggerEventActions";
import { fetchConditions } from "./conditionActions";
import { fetchActions } from "./actionActions";

import {
    APP_IS_FETCHING,
    APP_IS_READY,
    APP_NOT_READY,
} from "./ActionTypes";

const Config = window.Config;

let lastSystemFetchPromise;
export const fetchSystem = () => {
    return (dispatch, getState) => {
        if (getState().app.isFetching) {
            return lastSystemFetchPromise;
        }
        dispatch({ type: APP_IS_FETCHING });
        lastSystemFetchPromise =
            Promise.all([
                dispatch(fetchDatapointTypes),
                dispatch(fetchGroups()),
                dispatch(fetchDatapoints()),
                dispatch(fetchDataPointCtls()),
                dispatch(fetchTriggers()),
                dispatch(fetchConditions()),
                dispatch(fetchActions()),
            ])
                .then(() => dispatch({ type: APP_IS_READY }))
                .catch(error => dispatch({ type: APP_NOT_READY, error: error.message }));
        return lastSystemFetchPromise;
    };
};

/* POLLING */
export const pollSystem = () => {
    const delay = Config.polling.system ? Config.polling.system : Config.polling.default;
    return dispatch => dispatch(fetchSystem())
         .then(() => setTimeout(() => dispatch(pollSystem()), delay * 120))
         .catch(() => setTimeout(() => dispatch(pollSystem()), delay * 120));
};