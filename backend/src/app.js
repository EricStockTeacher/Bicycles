import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import client from './mongo.js';

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

app.get('/api/bicycle', async (req, res) => {
    //https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/
    const database = client.db("bicycle-store");
    const bikes = database.collection("bike");

    
    const findResult = await bikes.find({});
    let bikeData = [];
    for await(const doc of findResult) {
        console.log(doc);
        bikeData.push(doc);
    }
    
    return res.json(bikeData);
})

app.post('/api/bicycle', async (req, res) => {
    const name = req.body.name;
    const color = req.body.color;
    const image = req.body.image;

    if( !name || !color || !image ) {
        return res.status(400);
    }
    else {
        //https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateOne/
        const database = client.db("bicycle-store");
        const bikes = database.collection("bike");
        
        const result = await bikes.insertOne({ name: name, color: color, image: image} );
        
        console.log(result);
        
        return res.json({ name: name, color: color, image: image});
    }
})

app.delete('/api/bicycle', async (req, res) => {
    const name = req.body.name;

    const database = client.db("bicycle-store");
    const bikes = database.collection("bike");

    const deleteResult = await bikes.deleteOne({ name: name});

    return res.json({ deletedBikes: deleteResult.deletedCount})


})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})