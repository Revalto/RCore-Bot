const mongoose = require('mongoose');
const { Schema } = mongoose;

const AccountsClass = require('./accounts.class');

const accountsSchema = new Schema({
    userId: { type: Number, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    nickname: { type: String, required: true },
    registerDate: { type: Date, default: Date.now }
});

accountsSchema.loadClass(AccountsClass);
accountsSchema.index({ userId: -1 }, { unique: true });

module.exports = mongoose.model('Accounts', accountsSchema);
