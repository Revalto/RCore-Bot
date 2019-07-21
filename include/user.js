const db = require('./db');
const vk = require('./vk');

module.exports = {
  getUser: function (uid) {
    return new Promise((resolve, reject) => {
      db.get().collection('users').findOne({ uid: Number(uid) }, function(err, doc) {
        if(err) { return reject(err); }
        if(doc == null) {
          vk.get()._vk.api.call('users.get', {
          	user_ids: Number(uid),
          	fields: 'name,lastname,sex,photo_100'
          }).then(res => {
          	let user = res[0];

            var userInfo = {
              uid: Number(uid),
              name: user.first_name,
              right: 0,
              firstMessage: Math.floor(new Date() / 1000)
            };

            db.get().collection('users').insertOne(userInfo, function(err, result) {
              if(err) {
                return console.log(`[ RCORE ]: Ошибка при добавлении пользователя (MongoDB)`, err);
              }
              console.log(`[ RCORE ]: Зарегистрирован новый пользователь! UID: ${userInfo.uid} | Name: ${userInfo.name}`);
            });

            return resolve(userInfo);
          }).catch((error) => { console.log('[ RCORE ]: Ошибка получения данных о пользователе (vk-io)'); console.log(error); });
        } else {
          return resolve(doc);
        }
      });
    });
  },
  isUser: function(uid) {
    return new Promise((resolve, reject) => {
      db.get().collection('users').findOne({ uid: Number(uid) }, function(err, doc) {
        if(err) { return reject(err); }
        return resolve(( doc == null ? false : true ));
      });
    });
  },
  updateUser: function(uid, obj) {
    db.get().collection('users').updateOne({ uid: Number(uid) }, { $set: obj }, function(err, result) {
      if(err) { return console.log(`[ RCORE ]: Ошибка при обновление данных юзера (MongoDB)`, err); }
    });
  }
}
