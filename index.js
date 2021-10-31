const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port =process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wuozl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run (){
    try{
        await client.connect();
        const database = client.db('deliverySite');
        const productCollection = database.collection('products');
        const orderCollection = database.collection('orders');

        //POST api
        app.post('/products', async(req, res)=> {  
            const product = req.body; 
                console.log('hit the post api', product);

            const result = await productCollection.insertOne(product);
            console.log(result);
            res.json(result)
        });
        
        // GET products API
        app.get('/products',async (req, res)=> {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        //get single service
        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id);
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.json(product);
        })

        //add Orders
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);

            // delete orders onsubmit

        })

        
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('ema john server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})