import { Schema, model } from "mongoose";

const userSchema = new Schema({
 name: {
  type: String,
  required: true,
 },
 email: {
  type: String,
  required: true,
 },
 cart: {
  items: [
   {
    product: {
     type: Schema.Types.ObjectId,
     ref: 'Product', // MODEL BEING REFERED
     required: true,
    },
    quantity: {
     type: Number,
     required: true,
    },
   }
  ],
 },
});

// METHODS KEY IS OBJECT THAT ALLOWS TO ADD CUSTOM METHODS - THIS SHOULD BE A FUCTION THAT ALSO ALLOWS TO USE KEYWORD 'this'

// ADD/UPDATE ITEMS TO CART ASSOCIATED TO USER
userSchema.methods.addToCart = function (product) {
 // CHECK AND FIND IF THE PRODUCT IS ALREADY IN CART
 const cartProductIndex = this.cart.items.findIndex((cp) => {
  return cp.product.toString() === product._id.toString();
 });

 let newQuantity = 1;
 let updatedCartItems = [...this.cart.items];

 if (cartProductIndex >= 0) {
  // PRODUCT EXISTS IN CART ALREADY --- JUST UPDATE THE QUANTITY
  newQuantity = this.cart.items[cartProductIndex].quantity + 1;
  updatedCartItems[cartProductIndex].quantity = newQuantity;
 } else {
  // PRODUCT DOES NOT EXIST IN CART ALREADY --- PUSH/ADD THE PRODUCT TO CART
  updatedCartItems.push({
   product: product._id,
   quantity: newQuantity
  })
 }
 // UPDATE THE CART
 const updatedCart = { items: updatedCartItems };
 this.cart = updatedCart;
 return this.save();
}

// UPDATE/DELETE THE CART ITEM ASSOCIATED TO USER
userSchema.methods.deleteCartItem = function (productId) {
 const updatedCartItems = this.cart.items.map((item) => {
  if (item.product.toString() === productId.toString()) {
   if (item.quantity > 0) {
    return { ...item, quantity: item.quantity - 1 }
   }
  }
  return item
 }).filter((item) => {
  return item.quantity > 0
 })
 // UPDATE THE CART
 this.cart.items = updatedCartItems;
 return this.save();
};

// DELETE/CLEAR CART AFTER MOVING CART ITEMS TO ORDERS
userSchema.methods.clearCart = function () {
 this.cart = { items: [] }
 return this.save();
}

export default model('User', userSchema);