import { combineReducers } from 'redux';
import {datapointReducer} from './datapointReducer.js';
import {dataPointCtlReducer} from './dataPointCtlReducer';
import { reducer as toastrReducer } from 'react-redux-toastr';
import {eventReducer} from '../socket/clientSocket';
import {groupReducer} from './groupReducer';
import {appReducer} from './appReducer';
import {conditionReducer} from "./conditionReducer";
import {triggerReducer} from "./triggerEventReducer";
import {actionReducer} from "./actionReducer";
import {replayDataReducer} from "./replayReducer";
import { templateReducer } from './templateReducer.js';

const rootReducer = combineReducers({
    app: appReducer,
    actions: actionReducer,
    conditions: conditionReducer,
    templates: templateReducer,
    triggers: triggerReducer,
    toastr: toastrReducer,
    datapoints: datapointReducer,
    datapointctls: dataPointCtlReducer,
    groups: groupReducer,
    events: eventReducer,
    replaydata: replayDataReducer
});

export default rootReducer;
