const { getMongoClient } = require("../");

const db = getMongoClient().db();

const UsersCollection = db.collection("users");
UsersCollection.createIndex({ email: 1 }, { unique: true });

exports.UsersCollection = UsersCollection;
