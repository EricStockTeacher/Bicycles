import jwt from 'jsonwebtoken';
import { MongoClient, ServerApiVersion } from "mongodb";

export const handler = async (event) => {
    console.log(event);
    let name = event.body.name;
    if( !name ) {
        name = JSON.parse(event.body).name;
    }
    console.log(name);
    if( !name ) {
        //return res.status(400).json({message: "Missing bike to delete"})
        return {
            statusCode: 400,
            message: "Missing bike to delete"
        }
    }
    const { Authorization } = event.headers;
    console.log(Authorization);
    if( !Authorization ) {
        return {
            statusCode: 400,
            message: "Missing authorization header"
        }
    }
    try {
        const token = Authorization.split(' ')[1];
        console.log("step1");
        console.log(token);
        console.log(process.env.JWT_SECRET)
        const decoded = jwt.verify( token, process.env.JWT_SECRET);
        console.log("step2");
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

        const database = client.db("bicycle-store");
        const bikes = database.collection("bike");
        
        const deleteResult = await bikes.deleteOne({ name: name, email: decoded.email});

        //return res.json({ deletedBikes: deleteResult.deletedCount}) 
        return {
            statusCode: 200,
            body: JSON.stringify( { deletedBikes: deleteResult.deletedCount} )
        }
    }
    catch( error ) {
        //return res.status(500).json({message: error.message});
        return {
            statusCode: 500,
            message: error.message
        }
    }
}