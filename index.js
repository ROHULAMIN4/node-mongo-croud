const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const port = 5000;
// user:mydbuser1
// pass: CaexC4QdShW1yuC9

// manere
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://mydbuser1:CaexC4QdShW1yuC9@cluster0.4vnd1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("PhoneMaster");
    const usersCollection = database.collection("users");
    // Get api
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    // POST API
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      console.log("got new user", req.body);
      console.log("added user", result);
      res.json(result);
    });
    // update api
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.findOne(query);
      console.log("getting updateed", id);
      res.send(result);
    });

    // DELETE API
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = usersCollection.deleteOne(query);

      console.log("getting deleteing id", result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running my data");
});
app.listen(port, () => {
  console.log("Rninnng my server on port ", port);
});

// client.connect((err) => {
//   const collection = client.db("PhoneMaster").collection("User");
//   // perform actions on the collection object
//   console.log("hitiind the db");
//   const user = { name: "ali", email: "alo@gmail.com", phone: "019283838" };
//   collection.insertOne(user).then(() => {
//     console.log("insite data lode");
//   });
//   //   client.close();
// });
