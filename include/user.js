const db = require('./db');

module.exports = {
  get: async(context) => {
      const uid = Number(context.senderId);
      const user = await db.get().collection('users').findOne({ uid });

      if(user != null) {
          return user;
      }

      const VkUserInfo = await context.vk.api.call('users.get', {
         user_ids: uid,
      });

      if(!VkUserInfo || !VkUserInfo[0]) {
          return false;
      }

      const userInfo = {
          uid,
          name: VkUserInfo[0].first_name,
          right: 0,
          firstMessage: Math.floor(new Date() / 1000)
      };

      db.get().collection('users').insertOne(userInfo);
      return userInfo;
  }
}
