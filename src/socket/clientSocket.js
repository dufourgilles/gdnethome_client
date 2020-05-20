import io from 'socket.io-client';
import {RECEIVED_EVENT} from './../actions/ActionTypes';
import CircularBuffer from '../components/common/CircularBuffer';
import {createReducer} from "../utils/reduxHelper";
import {pollSystem} from "../actions/systemActions";

// Get config
const Config = window.Config;
const socket = io(Config.serverSocket);

const eventBuffer = new CircularBuffer();
const initialState = { items: [], error: null };

let callBack = null;
export const subscribeToEvents = (cb) => {
    const started = callBack != null;
    callBack = cb;
    if (started) {
        return;
    }
    socket.on('event', event => {
        eventBuffer.add(event);
        if (callBack) {
            callBack();
        }
    });
};

const processEvent = (state, action) => {
    return { ...state, items: action.events };
};

export const eventReducer = createReducer(initialState, {
    [RECEIVED_EVENT]: processEvent,
});

export const eventProcessor = () => dispatch => {
    //pollSystem()(dispatch);
    dispatch({type: RECEIVED_EVENT, events: [...eventBuffer]});
};

export const getEvents = (state) => {
  return state.events.items;
};

