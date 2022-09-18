const MongoClient = require("mongodb").MongoClient;

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
exports.getMongoClient = () => client;

exports.connectMongoDb = async (cb) => {
  try {
    await client.connect();
    cb(null);
  } catch (error) {
    cb(error);
  }
};
