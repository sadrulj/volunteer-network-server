const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ediyn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("networkDbUser");
    const itemsCollection = database.collection("services");
    const eventsCollection = database.collection("events");

    //GET Item Api
    app.get("/services", async (req, res) => {
      const cursor = itemsCollection.find({});
      const items = await cursor.toArray();
      res.send(items);
    });
    //GET events Api
    app.get("/events", async (req, res) => {
      const cursor = eventsCollection.find({});
      const events = await cursor.toArray();
      res.send(events);
    });

    //POST services api
    app.post("/services", async (req, res) => {
      const newItem = req.body;
      const result = await itemsCollection.insertOne(newItem);
      console.log("hitting the post", req.body);
      res.json(result);
    });

    //POST events api
    app.post("/events", async (req, res) => {
      const newItem = req.body;
      const result = await eventsCollection.insertOne(newItem);
      console.log("hitting the post", req.body);
      res.json(result);
    });

    //DELETE item api
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      console.log("deleting user with id", result);
      res.json(result);
    });

    //DELETE events api
    app.delete("/events/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      console.log("deleting user with id", result);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
