const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConversationsClass = require('./conversations.class');

const conversationsSchema = new Schema({
    peerId: { type: Number, required: true },

    ownerId: { type: Number, default: -1 },
    changeSettings: { type: Boolean, default: false }, // 1 - admins | 0 - owner
    welcome: { type: Boolean, default: true },

    type: { type: Number, default: 1 },
    timer: { type: Number, default: 90 },

    bans: {
        top: { type: Boolean, default: false },
        search: { type: Boolean, default: false },
        conversation: { type: Boolean, default: false }
    },

    registerDate: { type: Date, default: Date.now }
});

conversationsSchema.loadClass(ConversationsClass);
conversationsSchema.index({ peerId: -1 }, { unique: true });

module.exports = mongoose.model('Conversations', conversationsSchema);
