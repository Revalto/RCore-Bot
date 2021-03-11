const VKIO = require(`vk-io`);
const CommandManager = require('./libs/CommandManager');
const { QuestionManager } = require('vk-io-question-fix');
const { Logger } = require('./libs/utils/index');

class RCORE extends VKIO.VK {
    constructor(options) {
        super(options);

        // let date = new Date();

        this.Logger = new Logger(options.logsDir || null);
        this.questionManager = new QuestionManager();
        this.CommandManager = new CommandManager(options, this.Logger);

        this.init = this.init.bind(this);
        this.init();
    }

    async init() {
        await Promise.all([
            this.updates.use(this.questionManager.middleware),
            this.updates.use(this.CommandManager.middleware)
        ]);
    }
}

module.exports = { RCORE, ...VKIO };