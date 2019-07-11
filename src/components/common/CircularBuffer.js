
class CircularBuffer {
    constructor(maxSize = 10) {
        this._maxSize = maxSize;
        this._items = [];
        this._writeEntry = 0;
    }

    add(item) {
        this._items[this._writeEntry] = item;
        this._writeEntry = this._writeEntry < this._maxSize ? this._writeEntry + 1 : 0;
    }

    clear() {
        this._items = [];
        this._writeEntry = 0;
    }

    *[Symbol.iterator]() {
        let i = this._writeEntry - this._items.length;
        if (i < 0) {
            i += this._maxSize;
        }
        for(let count = 0; count < this._items.length; count++) {
            if (i >= this._maxSize) {
                i = 0;
            }
            yield this._items[i++];
        }
    }
}

export default CircularBuffer;