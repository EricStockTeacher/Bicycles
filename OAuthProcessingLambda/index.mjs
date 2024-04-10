import { google} from 'googleapis';
import { MongoClient, ServerApiVersion } from "mongodb";
import jwt from 'jsonwebtoken';

export const handler = async (event) => {
    const JWTSecret = "test123";
    const oauthClient = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.OAUTH_CALLBACK_URL
    );

    //return event;
    //console.log(event);

    const { code } = event.queryStringParameters;

    //console.log(code);
    //console.log(event);

    const { tokens } = await oauthClient.getToken(code);

    //console.log(tokens);

    const url = getAccessAndBearerTokenUrl(tokens.access_token);
    console.log(url);
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
                const response = {
                    "statusCode": 302,
                    "headers": {
                        "Location": `${process.env.APP_URL}/login?token=${token}`,
                    },
                }
                return response
                //res.redirect(`${process.env.APP_URL}/login?token=${token}`);
            });
        })
        .catch((error) => 
         {
            console.error(error);
            console.log(error);
            const response = {
                "statusCode": 500
            }
            return response;
         });
}

const updateOrCreateUserFromOauth = async (oauthUserInfo) => {
    //return { email: "ericstockteacher@gmail.com", name:"Eric Stock"};
    console.log(oauthUserInfo);
    const uri = process.env.MONGO_URI;
    //"mongodb+srv://ericstock:urJkxr3c7ccBxyUA@cluster0.fan0a.mongodb.net/?retryWrites=true&w=majority";

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    console.log(name);
    console.log(email);
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
    //return { email: "ericstockteacher@gmail.com", name: "Eric Stock" }
}

const getAccessAndBearerTokenUrl = (access_token) => {
    return `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
}

/*export const getGoogleOauthURL = () => {
    return oauthClient.generateAuthUrl( {
        access_type: 'offline',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ]
    })
}*/