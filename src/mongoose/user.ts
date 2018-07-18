import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstname: String,
  lastname: String
});

export default model('User', userSchema);
