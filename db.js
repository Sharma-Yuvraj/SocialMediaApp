const MongoClient = require('mongodb').MongoClient
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const url = process.env.URL;


var _db;

module.exports = {

    connectToServer: function (callback) {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            _db = client.db('storage');
            return callback(err);
        });
    },

    getDb: function () {
        return _db;
    }
};