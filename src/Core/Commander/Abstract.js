class Abstract {
    constructor(tag, callback, type) {
        this._tag = tag;
        this._callback = callback;
        this._type = type ?? 3;
    }

    getCallback() {
        return this._callback;
    }

    execute(...args) {
        return this._callback(...args);
    }

    getTag() {
        return this._tag;
    }

    getType() {
        return this._type;
    }

    isType(type) {
        return this._type === 3 || this._type === type;
    }

    isTag(text) {
        if(typeof(this._tag) == 'object' && !Array.isArray(this._tag)) {
            return this._tag.test(text);
        }

        if(typeof(this._tag) == 'string') {
            return this._tag === text;
        }

        return (new RegExp(`^\\s*(${this._tag.join('|')})`, "i")).test(name)
    }
}

module.exports = Abstract;