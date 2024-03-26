import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import client from './mongo.js';
import jwt from 'jsonwebtoken';
import {getGoogleOauthURL} from './oauthClient.js';
import {oauthClient} from './oauthClient.js'
import bikeModel from './bikeModel.js'


const app = express()

const googleOAuthURL = getGoogleOauthURL();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
const JWTSecret = "test123";


const getAccessAndBearerTokenUrl = (access_token) => {
    return `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
}


const updateOrCreateUserFromOauth = async (oauthUserInfo) => {
    const {
        name,
        email,
    } = oauthUserInfo;

    console.log(name);
    console.log(email);

    const database = client.db("bicycle-store");
    const users = database.collection("users");

    const existingUser = await users.findOne({email})

    if( existingUser ) {
        const result = await users.findOneAndUpdate({email}, 
            { $set: {name, email}},
            { returnDocument: "after"} 
        );
        return result;
    }
    else {
        const result = await users.insertOne( {email, name});
        return { email, name, _id: result.insertedId };
    }



    //return { email: "ericstockteacher@gmail.com", name: "Eric Stock" }
}

app.get( '/api/google/auth/callback', async (req, res) => {
    console.log("Hit callback route");

    const { code } = req.query;

    console.log(code);

    const { tokens } = await oauthClient.getToken(code);

    console.log(tokens);

    const url = getAccessAndBearerTokenUrl(tokens.access_token);

    const myHeaders = new Headers();
    const bearerToken = "Bearer "+tokens.id_token;
    myHeaders.append("Authorization", bearerToken);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => updateOrCreateUserFromOauth(result))
        .then((user) => {
            console.log(user)
            jwt.sign( {"name":user.name, "email":user.email}, JWTSecret, {expiresIn: '2d'}, (err, token) => {
                if(err) {
                    res.status(500).json(err);
                }
                res.redirect(`http://localhost:3000/login?token=${token}`);
            });
        })
        .catch((error) => 
         {
            console.error(error);
            res.status(500).json(err);
         });
})


app.get( '/api/google/url', (req, res) => {
    res.status(200).json({url: googleOAuthURL});
})

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


            const bikes = await bikeModel.find({email: decoded.email}).exec();
            console.log(bikes);
            //https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/
            /*const database = client.db("bicycle-store");
            const bikes = database.collection("bike");

            
            const findResult = await bikes.find({email: decoded.email});
            let bikeData = [];
            for await(const doc of findResult) {
                console.log(doc);
                bikeData.push(doc);
            }*/
            
            return res.json(bikes);

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

                const bike = new bikeModel( 
                    { name: name, color: color, image: image, email: decoded.email}
                )

                await bike.save();

                //https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateOne/
                /*const database = client.db("bicycle-store");
                const bikes = database.collection("bike");
                
                const result = await bikes.insertOne({ name: name, color: color, image: image, email: decoded.email} );
                
                console.log(result);
                
                return res.json({ name: name, color: color, image: image});*/
            })
        }
        catch( error ) {
            return res.status(500).json({message: 'error validating user'});
        }
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