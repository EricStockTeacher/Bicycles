//https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/#std-label-node-connect-to-mongodb

import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;

export const connect = () => {

  try {
    mongoose.connect(uri+'/bicycle-store');
  }
  catch( err ) {
    console.log(err);
  }

  mongoose.connection.on('error', err => {
    logError(err);
  });

  mongoose.connection.on('disconnected', msg => {
    logError(msg);
  });

}



