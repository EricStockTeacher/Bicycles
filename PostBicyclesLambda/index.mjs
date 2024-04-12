import { MongoClient, ServerApiVersion } from "mongodb";
import jwt from 'jsonwebtoken';

export const handler = async (event) => {
    console.log(event);

    const body = JSON.parse(event.body);
    const name = body.name;
    const color = body.color;
    const image = body.image;

    if( !name || !color || !image ) {
        return {
            "statusCode": 400,
            "body": "body not complete"
        }
    }

    const { Authorization } = event.headers;
    if( !Authorization ) {
        return {
            "statusCode": 400,
            "body": "missing authorization headers"
        }
    }
    
    const uri = process.env.MONGO_URI;
  
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri,  {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
    });
    
    try {
        const token = Authorization.split(' ')[1];
        console.log(token);  
        const decoded = jwt.verify( token, process.env.JWT_SECRET);
          
        await client.connect();
        const database = client.db("bicycle-store");
        const bikes = database.collection("bike");
        
        const result = await bikes.insertOne({ name: name, color: color, image: image, email: decoded.email} );
                
        console.log(result);
                
        return {
            "statusCode": 200,
            "body": JSON.stringify({ name: name, color: color, image: image})
        }
    }
    catch( err ) {
        console.log(err);
        return {
            "statusCode": 500,
            "body": err.message
        }
    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}