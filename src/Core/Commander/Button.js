const Abstract = require('./Abstract');

class Button extends Abstract {
    constructor(tag, callback, name, color) {
        super(tag, callback);

        this._name = name;
        this._color = color;
    }

    setName(name) {
        this._name = name;

        return this;
    }

    getName() {
        return this._name;
    }

    setColor(color) {
        this._color = color;

        return this;
    }

    getColor() {
        return this._color;
    }
}

module.exports = Button;