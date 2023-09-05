import { Schema, model } from "mongoose";

const productSchema = new Schema({
 title: {
  type: String,
  required: true,
 },
 price: {
  type: Number,
  required: true,
 },
 description: {
  type: String,
  required: true,
 },
 imageUrl: {
  type: String,
  required: true,
 },
 userId: {
  type: Schema.Types.ObjectId,
  ref: 'User', // MODEL THAT IS BEING REFERED,
  required: true,
 }
});

export default model('Product', productSchema);