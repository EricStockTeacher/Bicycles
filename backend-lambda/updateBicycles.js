 import { MongoClient, ServerApiVersion } from "mongodb";

export const handler = async (event) => {
  
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
    await client.connect();
  
    const database = client.db("bicycle-store");
    const bikes = database.collection("bike");

    const bike = await bikes.findOne({});
    console.log(bike);
    return bike;
    
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}