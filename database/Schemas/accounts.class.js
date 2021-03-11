const mongoose = require('mongoose');

module.exports = class Accounts extends mongoose.Model {
    constructor(user) {
        super(user);
    }

    /**
     * Создание пользователя по ID
     * @param {Number} userId 
     * @param {Class} vk 
     */
    static async createById(userId, vk) {
        const [userVK] = await vk.api.users.get({
            user_ids: userId
        });

        const { first_name, last_name } = userVK;

        let user = await this.create({
            userId: userId,
            first_name,
            last_name,
            nickname: first_name
        })

        return user;
    }

    /**
     * Поиск пользователя или создание по ID
     * @param {Number} userId 
     * @param {Class} vk 
     */
    static async findOrCreateById(userId, vk) {
        let user = await this.findOne({ userId });
        if(user == null) {
            user = await this.createById(userId, vk);
        }

        return user;
    }

    /**
     * Поиск пользователя по ID
     * @param {Number} userId 
     * @returns 
     */
    static async findById(userId) {
        const user = await this.findOne({ userId });

        return user;
    }
}