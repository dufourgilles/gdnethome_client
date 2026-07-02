// @ts-nocheck
import io from 'socket.io-client';
import CircularBuffer from '../components/common/CircularBuffer';

// Get config
const Config = window.Config || {};
const socket = io({
    path: Config.serverSocket || "/socketio",
    transports: ["websocket"],
    upgrade: false
});

socket.on("connect_error", error => {
    console.error("Socket.IO connection error", error);
});

socket.on("disconnect", reason => {
    console.warn("Socket.IO disconnected", reason);
});

const eventBuffer = new CircularBuffer();

let callBack = null;
const listeners = new Set();
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
        listeners.forEach(listener => listener([...eventBuffer]));
    });
};

export const eventProcessor = () => {
    listeners.forEach(listener => listener([...eventBuffer]));
};

export const getEvents = () => {
  return [...eventBuffer];
};

export const subscribeToEventBuffer = listener => {
    listeners.add(listener);
    listener([...eventBuffer]);
    return () => listeners.delete(listener);
};
