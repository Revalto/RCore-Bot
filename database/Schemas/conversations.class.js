const mongoose = require('mongoose');

const conversations = [];

module.exports = class Conversations extends mongoose.Model {
    constructor(user) {
        super(user);
    }

    /**
     * Создание беседы по ID
     * @param {Number} peerId 
     */
    static async createById(peerId) {
        let conversation = await this.create({
            peerId
        })

        return conversation;
    }

    /**
     * Получение беседы или создание по ID
     * @param {Number} peerId 
     */
    static async findOrCreateById(peerId) {
        let conversation = await this.findOne({ peerId });
        if(conversation == null) {
            conversation = this.createById(peerId);
        }

        return conversation;
    }

    /**
     * Поиск беседы по ID
     * @param {Number} userId 
     * @returns 
     */
     static async findById(userId) {
        const user = await this.findOne({ userId });

        return user;
    }
}