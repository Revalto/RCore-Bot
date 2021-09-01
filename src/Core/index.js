const VKIO = require(`vk-io`);
const Config = require('./Config');
const CommandManager = require('./Commander');
const Container = require('./Container');
const ControllerManager = require('./Controller');

class RCore extends VKIO.VK {
    constructor(options, debug = false) {
        super(options);

        this.debug = debug;
        this.commandManager = new CommandManager(this);
        this.config = new Config();
        this.container = new Container();
        this.controllerManager = new ControllerManager(this.container);

        this._init();
    }

    _init() {
        this.container.service('app', c => this);
        this.updates.on('message_new', this.commandManager.middleware);
    }

    start() {
        this.updates.startPolling();
    }
}

module.exports = {
    RCore,
    ...VKIO
};