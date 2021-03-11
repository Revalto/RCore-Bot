const mongoose = require('mongoose');
const { db } = require('../configs');
const { urlDB, dbName } = db;

const Accounts = require('./Schemas/accounts.schema');
const Conversations = require('./Schemas/conversations.schema');

mongoose.connect(urlDB, {
    dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    useCreateIndex: true,
    serverSelectionTimeoutMS: 5000
})
    .then(() => console.log('[ RCORE ] Mongoose connected'))
    .catch((err) => console.log(`[ RCORE ] Mongoose ERR - ${err.message}`));

mongoose.connection.on('connected', () => {
    console.log(`[ RCORE ] [ Mongoose ] Connected to db.`);
});

mongoose.connection.on('error', (err) => {
    console.log(`[ RCORE ] [ Mongoose ] ERR - ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.log(`[ RCORE ] [ Mongoose ] connection is disconnected.`);

    process.exit(1);
});

module.exports = { mongoose, Accounts, Conversations };