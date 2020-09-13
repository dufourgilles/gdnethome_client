class CircularBuffer {
  constructor(maxSize = 10) {
    this._maxSize = maxSize;
    this._items = [];
  }

  push(item) {
    this._items.push(item);
    if (this._items.length > this._maxSize) {
      this._items.shift();
    }
  }

  clear() {
    this._items = [];
  }

  *[Symbol.iterator]() {
    for (let position = 0; position < this._items.length; position++) {
      yield this._items[position];
    }
  }

  slice() {
    return Array.prototype.slice.apply(this._items, arguments);
  }
}

export default CircularBuffer;
