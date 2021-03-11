const glob = require('glob');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const findFiles = promisify(glob);

module.exports = class CommandManager {
    constructor(options, logger) {
        this.commandsDir = options.commandsDir
            || './commands';

        this.commands = [];
        this.lastCheckDirectory = Date.now();

        this.Logger = logger;

        this.init = this.init.bind(this);
        this.middleware = this.middleware.bind(this);

        this.init();
        this.watchCommands();
    }

    async init() {
        const absPath = path.resolve(this.commandsDir);
        const filePaths = await findFiles(`${absPath}/**/*.js`);
        
        for(const filePath of filePaths) {
            if (this.lastCheckDirectory) {
                delete require.cache[require.resolve(filePath)];
            }

            const file = require(filePath);

            this.commands.push(file);
        }
    }

    async watchCommands() {
        const absPath = path.resolve(this.commandsDir);
        fs.watch(absPath, async(event) => {
            console.log(`watch`, event);
            if (event === 'rename' || Date.now() - this.lastCheckDirectory < 200) {
                return;
            }

            this.Logger.info('Перезагрузка команд...');

            this.commands = [];
            this.lastCheckDirectory = Date.now();
            await this.init();
        })
    }

    async middleware(context, next) {
        if(!context.hasText || context.isOutbox) {
            await next();

            return;
        }

        let command = null;

        for(const cmd of this.commands) {

            const isChat = context.isChat ? 'TYPE_CONVERSATION' : 'TYPE_PRIVATE';
            if(cmd.type != 'TYPE_ALL' && cmd.type != isChat) {
                continue;
            }

            const { messagePayload, text } = context;
            const type = messagePayload && messagePayload.command ? 'button' : 'tag';
            const textCommand = messagePayload && messagePayload.command ? messagePayload.command : text;

            if(type == `tag`) {
                textCommand.replace(/^\[club(\d+)\|(.*)\]/i, '');
            }

            const [ name, ...args ] = textCommand
                .trim()
                .split(type == `button` ? `_` : /\s+/);

            if( 
                (typeof cmd[type] == "object" && !Array.isArray(cmd[type]) && cmd[type].test(name))
                || (new RegExp(`^\\s*(${cmd[type].join('|')})`, "i")).test(name) 
            ) {
                command = {
                    ...cmd, 
                    about: { name, args, text: textCommand, type }
                }
                
                break;
            }

        }  

        context.command = command;
        context.hasCommand = command != null

        await next();
    }
}