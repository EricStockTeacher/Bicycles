import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import client from './mongo.js';
import jwt from 'jsonwebtoken';

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
const JWTSecret = "test123";

app.get('/api/login', (req, res) => {
    jwt.sign( {"name":"Eric", "email":"ericstockteacher@gmail.com", "accountId":12}, JWTSecret, {expiresIn: '2d'}, (err, token) => {
        if(err) {
            res.status(500).json(err);
        }
        res.status(200).json({token});
    });
});

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

app.get('/api/bicycle', async (req, res) => {

    const { authorization } = req.headers;
    console.log(authorization);

    if( !authorization ) {
        res.status(400).json({message: "Authorization needed"})
    }


    try {

        const token = authorization.split(' ')[1];
        console.log(token);
        //ok so have a token and we want to verify it
        jwt.verify( token, JWTSecret, async(err, decoded) => {
            if(err) {
                return res.status(400).json({message: 'Unable to verify token'});
            }

            console.log(decoded);
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
    }
    catch( error ) {
        return res.status(500).json({message: 'error validting user'})
    }
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