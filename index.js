const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const Objectid = require('mongodb').ObjectId;
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;



//use middleware
app.use(cors());
app.use(express.json());



//user: dbuser1;
// password : s7Yb9x1h46B5oWVi;


const uri = "mongodb+srv://dbuser1:s7Yb9x1h46B5oWVi@cluster0.3g0iw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollaction = client.db('foodExpress').collection('user');

        //get users
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollaction.find(query);
            const user = await cursor.toArray();
            res.send(user)

        })
        //update user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: Objectid(id) };
            const options = { upsert: true };
            const updateDoc  = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email
                }
            }
            const result = await userCollaction.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: Objectid(id) };
            const result = await userCollaction.findOne(query);
            res.send(result);

        })
        //POST User : add a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user ', newUser);
            const result = await userCollaction.insertOne(newUser);
            res.send(result);
        })

        //delete a user
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: Objectid(id) };
            const result = await userCollaction.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my node crude server')
})

app.listen(port, () => {
    console.log('Crude server is running');
})