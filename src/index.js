/**
 * Load env settings
 */
const path = require('path');
const env = require('dotenv').config({
    path: path.join(__dirname, '../.env')
});

/**
 * Load RCore
 */
const { RCore } = require('./Core');
const App = new RCore({
    token: process.env.VK_TOKEN
});

/**
 * Apply Configs
 */
App.config.load(require('./config'));

/**
 * Apply Controllers and Routes
 */
require('./app/Controllers')(App.controllerManager);
require('./routes')(App.commandManager, App.controllerManager);

/**
 * Updates
 */
App.updates.on('message_new', (context) => {
    if(!context.hasCommand) {
        return;
    }

    // ...code

    context._command.execute(context);
});

/**
 * Start Bot
 */
App.start();