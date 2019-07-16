const MongoClient = require("mongodb").MongoClient;
const ObjectID    = require("mongodb").ObjectID;

var state = {
  db: null
};
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

exports.connect = function (url, done) {
  if(state.db) {
    return done();
  }

  mongoClient.connect(function(err, db){
    if(err) {
      return done(err);
    }
    state.db = db;
    done();
  })
}

exports.get = function() {
  return state.db;
}

exports.obj = function() {
  return ObjectID;
}
