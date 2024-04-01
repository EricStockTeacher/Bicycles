import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String
});

const userModel = model('user', userSchema);
export default userModel;