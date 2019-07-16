const db = require('./db');

module.exports = {
  getUser: function (uid, vk) {
    return new Promise((resolve, reject) => {
      db.get().db('goldenmine').collection('users').findOne({ uid: Number(uid) }, function(err, doc) {
        if(err) { console.log(err); }
        if(doc == null) {
          vk.api.call('users.get', {
          	user_ids: Number(uid),
          	fields: 'name,lastname,sex,photo_100'
          }).then(res => {
          	let user = res[0]; // user.first_name

            var userInfo = {
              uid: Number(uid),
              name: user.first_name,
              right: 0,
              balance: 5000,
              firstMessage: Math.floor(new Date() / 1000)
            };

            db.get().db('rcore').collection('users').insertOne(userInfo, function(err, result) {
              if(err) {
                console.log(`[ RCORE ]: Ошибка при добавлении пользователя (MongoDB)`);
                console.log(err);
              }
              console.log(`[ RCORE ]: Зарегистрирован новый пользователь! UID: ${userInfo.uid} | Name: ${userInfo.name}`);
            });

            return resolve(userInfo);
          }).catch((error) => { console.log('[ RCORE ]: Ошибка получения данных о пользователе (vk-io)'); console.log(error); });
        } else { return resolve(doc); }
      });
    });
  },
  random: function(x, y) {
    return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
  },
  number_format: function( number, decimals, dec_point, thousands_sep ) {
		var i, j, kw, kd, km;
		if( isNaN(decimals = Math.abs(decimals)) ){
			decimals = 2;
		}
		if( dec_point == undefined ){
			dec_point = ",";
		}
		if( thousands_sep == undefined ){
			thousands_sep = ".";
		}

		i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

		if( (j = i.length) > 3 ){
			j = j % 3;
		} else{
			j = 0;
		}

		km = (j ? i.substr(0, j) + thousands_sep : "");
		kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
		kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");
		return km + kw + kd;
	}
}
