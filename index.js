const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

// middleware-------------
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lhckmem.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {

        const productsCollection = client.db('emaJohn').collection('products')

        // mongo teke data load--------
        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size);
            const query = {}
            const cursor = productsCollection.find(query)
            const products = await cursor.skip(page * size).limit(size).toArray()
            // pagination----------
            const count = await productsCollection.estimatedDocumentCount()
            res.send({ count, products })
        })

        // query di id kuje shopping cart a set-----------
        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;  // ids ObjectId nai tai result ooooo
            const objectIds = ids.map(id => ObjectId(id))

            const query = { _id: { $in : objectIds } }

            const cursor = productsCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)
        })







    }
    catch (error) {
        console.log(error.name, error.message);
    }

}

run().catch(error => console.log(error))


app.get('/', (req, res) => {
    res.send("Ema john simple server is running")
});

app.listen(port, () => console.log('Ema john running port on :', port))