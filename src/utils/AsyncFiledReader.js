
export default class AsyncFileReader {
    constructor() {
        this._reader = new FileReader();
        this._reader.onload = this._onload.bind(this);
        this._reader.onerror = this._onerror.bind(this);
        this._cb;
        this._resolve;
    }

    _onerror(e) {
        if (this._cb) {
            this._cb(e);
        }
        if (this._reject) {
            this._reject(e);
        }
    }

    _onload(evt) {
        const txt = evt.target.result;
        if (this._cb) {
            this._cb(null, txt);
        }
        if (this._resolve) {
            this._resolve(txt);
        }
    }

    read(fileName, cb) {
        this._cb = cb;
        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
            this._reader.readAsText(fileName, "UTF-8");
        });
    }
}