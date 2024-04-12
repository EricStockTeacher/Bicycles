import { MongoClient, ServerApiVersion } from "mongodb";
import jwt from 'jsonwebtoken';

export const handler = async (event) => {
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
        }
    );
  
  try {
        const token = Authorization.split(' ')[1];
        const decoded = jwt.verify( token, process.env.JWT_SECRET);
        const database = client.db("bicycle-store");
        const bikes = database.collection("bike");
  
        const findResult = await bikes.find({email: decoded.email});
        let bikeData = [];
        for await(const doc of findResult) {
            bikeData.push(doc);
        }
        const res = {
            "statusCode": 200,
            "body": JSON.stringify(bikeData)
        }
        return res;
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