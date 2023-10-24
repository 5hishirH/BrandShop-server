const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const uri = `mongodb+srv://${process.env.BRAND_SHOP}:${process.env.BRAND_SHOP_PASS}@cluster0.e2ydxes.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    //...
    const brandCollection = client.db("brandShopDB").collection("brand");
    const productCollection = client.db("productDB").collection("product");

    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/brands/:id", async (req, res) => {
      const id = req.params.id;
      const query1 = { _id: new ObjectId(id) };
      const result = await brandCollection.findOne(query1);
      // const searchString = 'Nike';
      // const regexPattern = new RegExp(searchString, 'i');
      // const prods = productCollection.find({ brand_name: regexPattern }).toArray();
      // if(prods) {
      //   result.products = prods;
      // }
      res.send(result);
    });

    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
  });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
