import { Schema, model } from 'mongoose';

const countersSchema = new Schema({
  counters: [Number]
});

export default model('Counters', countersSchema);
