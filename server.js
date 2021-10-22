const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const app = express();

//middleware
app.use(cors());
app.use(express.json());
dotenv.config();

const port = process.env.PORT;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const dbConnect = async () => {
    try {
        await client.connect();
        const productCollection = client.db("storeManagement").collection("products");

        // GET API
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            if ((await cursor.count()) === 0) {
                res.send([]);
            }
            else {
                const products = await cursor.toArray();
                res.json(products);
            }
        })

        app.get('/product/:productID', async (req, res) => {
            const productID = req.params.productID;
            const query = { _id: ObjectId(productID) };
            const product = await productCollection.findOne(query);
            res.json(product);
        })
    }
    finally {
    }
};

dbConnect();

app.get('/', (req, res) => {
    res.send('Store Management API is Live')
})

app.listen(port, () => {
    console.log(`Server API listening at http://localhost:${port}`)
})