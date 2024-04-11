import { google} from 'googleapis';
import { MongoClient, ServerApiVersion } from "mongodb";
import jwt from 'jsonwebtoken';

export const handler = async (event) => {

    const JWTSecret = process.env.JWT_SECRET;
    const oauthClient = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.OAUTH_CALLBACK_URL
    );
    const { code } = event.queryStringParameters;

    const { tokens } = await oauthClient.getToken(code);

    const url = getAccessAndBearerTokenUrl(tokens.access_token);

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    try {
        let response = await fetch(url, requestOptions)
        console.log(response);
        let result = await response.json();
        let user = await updateOrCreateUserFromOauth(result);
        
        const token = jwt.sign( {"name":user.name, "email":user.email}, JWTSecret, {expiresIn: '2d'} );
        return {
                "statusCode": 302,
                "headers": {
                    "Location": `${process.env.APP_URL}/login?token=${token}`,
                }
            }
    } catch(err) {
        console.error(error);
        return {
            "statusCode": 500
        }
    }
}

const updateOrCreateUserFromOauth = async (oauthUserInfo) => {
    const uri = process.env.MONGO_URI;
    console.log("Creating New Mongo Client");
    const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    const {
        name,
        email,
    } = oauthUserInfo;

    try {
        await client.connect();
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
    }
    finally {
        await client.close();
    }
}

const getAccessAndBearerTokenUrl = (access_token) => {
    return `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
}