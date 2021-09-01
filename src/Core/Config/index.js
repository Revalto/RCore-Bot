class Config {
    constructor() {
        this._config = {};
    }

    load(arr) {
        if(typeof(arr) != 'object') {
            throw new Error('Not object!');
        }

        Object.entries(arr).forEach(([key, value]) => this.set(key, value));
    }

    set(key, value) {
        this._config[key] = value;
    }

    get(configName, key = null) {
        if(!configName) {
            throw new Error('configName empty!');
        }

        if(!this._config.hasOwnProperty(configName)) {
            throw new Error('Config not founded!');
        }

        const config = this._config[configName];

        if(key !== null) {
            return config[key] || null;
        }

        return config;
    }
}

module.exports = Config;