const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return client.db("employee-system");
  }

  try {
    await client.connect();
    await client.db("employee-system").command({ ping: 1 });
    console.log("Connected to the database");
    isConnected = true;
  } catch (err) {
    console.log(err);
  }

  return client.db("employee-system");
}
