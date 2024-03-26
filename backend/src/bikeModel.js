import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bikeSchema = new Schema({
  name: String,
  color: String,
  image: String,
  email: String
});

const bikeModel = model('bike', bikeSchema);
export default bikeModel;