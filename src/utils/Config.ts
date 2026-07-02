// @ts-nocheck
window.Config = Object.assign({}, {
    "serverURL": "/api",
    "serverSocket": "/socketio",
    "maxNotif": 1024,
    "defaultTimespanFormat":"DD/MM/YYYY HH:mm:ss",
    "toastrActivated": true,
    "polling": {
        "default": 1000
    },
    "bandwidthsMaxRetention": 60 // seconds
} , window.Config);
