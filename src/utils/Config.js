const protocol = window.location.protocol;
const hostname = window.location.hostname;
const baseUrl = `${protocol}//${hostname}`;
window.Config = Object.assign({}, {
    "serverURL": `${baseUrl}:8080`,
    "serverSocket": `${baseUrl}:8081`,
    "maxNotif": 1024,
    "defaultTimespanFormat":"DD/MM/YYYY HH:mm:ss",
    "toastrActivated": true,
    "polling": {
        "default": 1000
    },
    "bandwidthsMaxRetention": 60 // seconds
} , window.Config);