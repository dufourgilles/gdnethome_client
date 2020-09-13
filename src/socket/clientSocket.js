import io from "socket.io-client";
import { RECEIVED_EVENT } from "./../actions/ActionTypes";
import CircularBuffer from "../components/common/CircularBuffer";
import { createReducer } from "../utils/reduxHelper";

// Get config
const Config = window.Config;
const socket = io(Config.serverSocket);

const initialState = {
  items: new CircularBuffer(Config.maxNotif),
  error: null,
};

let callBack = null;
export const subscribeToEvents = (cb) => {
  const started = callBack != null;
  callBack = cb;
  if (started) {
    return;
  }
  socket.on("event", (event) => {
    console.log("Got event", event);
    if (callBack) {
      callBack(event);
    }
  });
};

const processEvent = (state, action) => {
  state.items.push(action.event);
  return { ...state };
};

export const eventReducer = createReducer(initialState, {
  [RECEIVED_EVENT]: processEvent,
});

export const eventProcessor = (event) => (dispatch) => {
  dispatch({ type: RECEIVED_EVENT, event });
};

export const getEvents = (state) => {
  return [...state.events.items];
};
