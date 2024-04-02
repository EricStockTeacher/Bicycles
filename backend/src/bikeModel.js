import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bikeSchema = new Schema({
  name: { type: String, required: true },
  color: String,
  image: String,
  email: { type: String, required: true }
});

const bikeModel = model('bike', bikeSchema);
export default bikeModel;