const { VK, Keyboard }	= require('vk-io');
const vk 			    			= new VK();
const config 	    			= require("./config.js");
const fs 			    			= require('fs');
const colors 		  			= require('colors');
const db          			= require('./include/db');
const util          		= require('./include/util');

const cmds = fs.readdirSync(`${__dirname}/cmds/`).filter((name) => /\.js$/i.test(name)).map((name) => require(`${__dirname}/cmds/${name}`));
vk.setOptions({ token: config.groupToken, pollingGroupId: config.groupID });

/* ------------------------- [ Бот ]  ------------------------- */

vk.updates.on(['new_message', 'edit_message'], async(context) => {
	if (context.senderId < 1 || context.isOutbox) {
		return;
	}

	var user = await util.getUser(context.senderId, vk);

	let cmd = cmds.find( context.messagePayload && context.messagePayload.command ? (cmd => cmd.bregexp ? cmd.bregexp.test(context.messagePayload.command) : (new RegExp(`^\\s*(${cmd.button.join('|')})`, "i")).test(context.messagePayload.command)):(cmd => cmd.regexp ? cmd.regexp.test(context.text) : (new RegExp(`^\\s*(${cmd.tag.join('|')})`, "i")).test(context.text)) );
	if(!cmd) return (!context.isChat ? context.send('&#128213; | Команда не найдена | Напишите "Начать"'):'');
	else cmd["cmd"] = (context.messagePayload && context.messagePayload.command ? context.messagePayload.command : context.text);

	try {
		await cmd.func(context, { db, util, user, cmd, cmds, vk, VK, Keyboard, cmd, fs });
	}
	catch (e) {
		console.log(`Ошибка:\n${e}`.red.bold);
	}
});

async function run() {
  await db.connect("mongodb://localhost:27017/", function(err) {
    if(err) {
      console.log(`[ RCORE ] Ошибка подключения к базе данных! (MongoDB)`);
      return console.log(err);
    }
    console.log(`[ RCORE ] Успешно подключен к базе данных! (MongoDB)`);
  });

	await vk.updates.start().catch(console.error);
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
