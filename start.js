const fs = require('fs');
const colors = require('colors');

const config = require("./config.js");
const db = require('./include/db');
const vk = require('./include/vk');
const util = require('./include/util');

const user = require('./include/user');

const cmds = fs.readdirSync(`${__dirname}/cmds/`).filter((name) => /\.js$/i.test(name)).map((name) => require(`${__dirname}/cmds/${name}`));

/* ------------------------- [ Бот ]  ------------------------- */

vk.setHook(['new_message', 'edit_message'], async(context) => {
	if (context.senderId < 1 || context.isOutbox) {
		return;
	} console.log(context);

	let cmd = cmds.find( context.messagePayload && context.messagePayload.command ? (cmd => cmd.bregexp ? cmd.bregexp.test(context.messagePayload.command) : (new RegExp(`^\\s*(${cmd.button.join('|')})`, "i")).test(context.messagePayload.command)):(cmd => cmd.regexp ? cmd.regexp.test(context.text) : (new RegExp(`^\\s*(${cmd.tag.join('|')})`, "i")).test(context.text)) );
	if(!cmd) return (!context.isChat ? context.send('&#128213; | Команда не найдена | Напишите "Начать"'):'');
	else cmd["cmd"] = (context.messagePayload && context.messagePayload.command ? context.messagePayload.command : context.text);

	var _user = await user.getUser(context.senderId);

	await cmd.func(context, { db, util, user, _user, cmd, cmds, vk, cmd, fs }).then(() => {}).catch((e) => {
		console.log(`Ошибка:\n${e}`.red.bold);
	});
})

async function run() {
  await db.connect(function(err) {
    if(err) { return console.log(`[ RCORE ] Ошибка подключения к базе данных! (MongoDB)`, err); }
    console.log(`[ RCORE ] Успешно подключен к базе данных! (MongoDB)`);
  });

	await vk.connect(function(err) {
		if(err) { return console.log(`[ RCORE ] Ошибка подключения! (VK)`, err); }
		console.log(`[ RCORE ] Успешно подключен! (VK)`)
	});

	console.log(`[ RCORE ] Бот успешно запущен и готов к работе!`);
}

run().catch(console.error);

/* ------------------------- [ Консолим ошибки ]  ------------------------- */

process.on("uncaughtException", e => {
	console.log(e);
});

process.on("unhandledRejection", e => {
	console.log(e);
});
