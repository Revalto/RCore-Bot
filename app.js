const VKCOINAPI = require('node-vkcoinapi');
const { stripIndents } = require('common-tags');
const VKIO = require('./bot');

const { Accounts, Conversations } = require('./database');

const config = require('./configs');
const utils = require('./libs/utils');

const vk = new VKIO.RCORE({ 
    ...config.vk, 
    logsDir: './logs' 
});

const vkcoin = new VKCOINAPI(config.vkcoin);

const start = async() => {
    // VK
    await vk.updates.start();
    await vk.updates.on('new_message', async(context, next) => {
        if(!context.hasText || context.isOutbox || !context.hasCommand) {
            await next();

            return;
        }
        console.log(context)
        // Получение пользователя
        context.user = await Accounts.findOrCreateById(+context.senderId, vk);

        // Получение беседы
        context.conversation = context.isChat
            ? await Conversations.findOrCreateById(+context.peerId)
            : null;

        // Выполнение команды
        try {
            await Promise.all([
                context.command.execute(context, { VKIO, vk, vkcoin, Accounts, utils, stripIndents, config }),
    
                next()
            ]);
        } catch(e) {
            vk.Logger.error(e.stack);
        } finally {
            // Если есть изменения - сохраняем
            if(context.user.isModified()) {
                await context.user.save();
            }

            // Если есть беседа и есть изменения - сохраняем
            if(context.conversation != null && context.conversation.isModified()) {
                await context.conversation.save();
            }
        }
    });

    // VKCOINAPI
    await vkcoin.updates.startPolling(vk.Logger.info);
    await vkcoin.updates.onTransfer(async(event) => {
        const { amount, fromId, id } = event;
        const score = vkcoin.api.formatCoins(amount);
        
        vk.Logger.info(
            `[ ${fromId} ] [ tx: ${id} ] Пополнил свой баланс на ${score} (${amount})`
        );

        let user = await Accounts.findOne({ userId: +fromId });
        if(user == null || amount < 1000) {
            return;
        }

        user.balance.now += Math.floor(amount / 1000);
        user.save();

        vk.api.messages.send({
            peer_id: fromId,
            message: `[ 📥 ] • На ваш баланс было зачислено: ${score} VK COIN's`,
            random_id: VKIO.getRandomId()
        });
    });
}

start();