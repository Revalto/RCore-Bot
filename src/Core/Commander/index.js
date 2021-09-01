const Command = require('./Command');
const Button = require('./Button');

class CommandManager {
    constructor() {
        this.TYPE = {
            COMMAND: 1,
            BUTTON: 2
        }

        this.MESSAGE_TYPE = {
            CONVERSATION: 1,
            PRIVATE: 2,
            ALL: 3
        }

        this._commands = [];
        this._buttons = [];

        this.middleware = this.middleware.bind(this);
    }

    addCommand(tag, callback) {
        const command = new Command(tag, callback);

        this._commands.push(command);

        return command;
    }

    addButton(tag, callback, name, color) {
        const button = new Button(tag, callback, name, color);

        this._buttons.push({
            tag,
            button
        });

        return button;
    }

    find(key, text, type) {
        return this[key].find(res => {
            if(!res.isType(type)) {
                return false;
            }

            return res.isTag(text);
        });
    }

    findCommand(text, type) {
        return this.find('_commands', text, type) || null;
    };

    findButton(text, type) {
        return this.find('_buttons', text, type) || null;
    }

    async middleware(context, next) {
        if(!context.hasText || context.isOutbox) {
            await next();

            return;
        }

        let command = null;

        const { messagePayload, text } = context;
        const messageType = context.isChat
            ? this.MESSAGE_TYPE.CONVERSATION
            : this.MESSAGE_TYPE.PRIVATE;

        const type = messagePayload && messagePayload.command
            ? this.TYPE.BUTTON
            : this.TYPE.COMMAND;

        const textCommand = messagePayload && messagePayload.command
            ? messagePayload.command
            : text;

        if(type === this.TYPE.COMMAND) {
            textCommand.replace(/^\[club(\d+)\|(.*)\]/i, '');
        }

        const [ name, ...args ] = textCommand
            .trim()
            .split(type === this.TYPE.BUTTON ? `_` : /\s+/);

        if(type === this.TYPE.COMMAND) {
            command = this.findCommand(name, messageType)
        }

        if(type === this.TYPE.BUTTON) {
            command = this.findButton(name, messageType);
        }

        context._command = command;
        context.hasCommand = command !== null;

        await next();
    }
}

module.exports = CommandManager;