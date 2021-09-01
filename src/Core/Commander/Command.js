const Abstract = require('./Abstract');

class Command extends Abstract {
    constructor(tag, callback) {
        super(tag, callback);
    }
}

module.exports = Command;