const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ic5wod.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

// connecting db
const connectDB = async () => {
  if (db) return db;

  await client.connect();
  db = client.db("learnersCareDb");
  console.log("MongoDB Connected!");
  return db;
};

// getting coll.s
const getCollection = async (collectionName) => {
  if (!db) db = await connectDB(); // ✅ db না থাকলে আগে connect করবে
  return db.collection(collectionName);
};

module.exports = { connectDB, getCollection };