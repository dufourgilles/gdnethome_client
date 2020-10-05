const protocol = window.location.protocol;
const hostname = window.location.hostname;
//const baseUrl = `${protocol}//${hostname}`;
const baseUrl = "http://192.168.1.43"
const DEFAULT_CONFIG = {
    "serverURL": `${baseUrl}:8080`,
    "serverSocket": `${baseUrl}:8081`,
    "maxNotif": 1024,
    "defaultTimespanFormat":"DD/MM/YYYY HH:mm:ss",
    "toastrActivated": true,
    "polling": {
        "default": 1000
    },
    "bandwidthsMaxRetention": 60 // seconds
};

window.Config = { ...DEFAULT_CONFIG , ...window.Config};