import path from 'path'
import rootDir from '../util/path'
import Product from "../models/product.model";
import User from '../models/user.model';

// CAN USE SAME FILE (add-product.ejs OR edit-product.ejs) TO DO BOTH ADD AND EDIT PRODUCT 

// ADMIN GET ADD PRODUCT FORM PAGE
export const getAdminAddProduct = (req, res, next) => {
 res.render(path.join(rootDir, 'views', 'admin', 'edit-product.ejs'), {
  pageTitle: 'Add Product',
  path: '/admin/add-product',
  editing: false,
 });
}

// ADMIN POST ADD PRODUCT
export const postAdminAddProduct = (req, res, next) => {
 const { title, imageUrl, price, description } = req.body;
 const product = new Product({
  title: title,
  imageUrl: imageUrl,
  price: price,
  description: description,
  userId: req.user, // MONGOOSE WIL AUTOMATICALLY SAVE JUST THE ID EVEN IF WHOLE USER OBJECT IS PASSED TO userId
 });
 product.save().then((result) => {
  // console.log("file: admin.controller.js:28 ~ Product.save ~ result:", result);
  res.redirect('/admin/products')
 }).catch((err) => {
  console.log("file: admin.controller.js:21 ~ Product.save ~ err:", err);
 })
}

// ADMIN GET PRODUCTS
export const getAdminProducts = (req, res, next) => {
 // POPULATE TELLS MONGOOSE TO POPULATE A CERTAIN FIELD WILTH ALL DETAIL INFORMATION INSTEAD OF JUST ID
 Product.find({ userId: req.user._id }).populate('userId').then((product) => {
  // console.log("file: admin.controller.js:36 ~ Product.find ~ product:", product);
  res.render(path.join(rootDir, 'views', 'admin', 'admin-products.ejs'), {
   prods: product,
   pageTitle: 'Admin-Products',
   path: '/admin/products',
  });
 }).catch((err) => {
  console.log("file: admin.controller.js:43 ~ Product.find ~ err:", err);
 })
}

// ADMIN GET EDIT PRODUCT FORM/PAGE
export const getEditAdminProduct = (req, res, next) => {
 const { id } = req.params
 const { edit } = req.query
 if (!edit) {
  return res.redirect('/admin/products')
 }
 Product.findById(id).then((product) => {
  // console.log("file: admin.controller.js:55 ~ Product.findById ~ product:", product);
  res.render(path.join(rootDir, 'views', 'admin', 'edit-product.ejs'), {
   prods: product,
   pageTitle: 'Edit Product',
   path: '/admin/edit-product',
   editing: edit,
  })
 }).catch((err) => {
  console.log("file: admin.controller.js:63 ~ Product.findById ~ err:", err);
 })
}

// ADMIN POST UPDATE PRODUCT
export const postAdminUpdatedProduct = (req, res, next) => {
 const { title, imageUrl, price, description, productId } = req.body;
 Product.updateOne({ _id: productId }, { $set: { title: title, price: price, description: description, imageUrl: imageUrl } }).then((product) => {
  // console.log("file: admin.controller.js:71 ~ product.updateOne ~ product:", product);
  res.redirect('/admin/products')
 }).catch((err) => {
  console.log("file: admin.controller.js:74 ~ product.updateOne ~ err:", err);
 })
}

// ADMIN DELETE PRODUCT
export const deleteAdminProduct = (req, res, next) => {
 const { productId } = req.body;
 // Product.deleteOne({ _id: productId }).then((product) => {
 //  // console.log("file: admin.controller.js:82 ~ Product.deleteOne ~ product:", product);
 //  res.redirect('/admin/products');
 // }).catch((err) => {
 //  console.log("file: admin.controller.js:85 ~ Product.deleteOne ~ err:", err);
 // })

 // IF THE PRODUCT IS DELETED AND THIS DELETED PRODUCT IS PART OF ANY USER; DELETE PRODUCT FROM USER'S CART TOO

 Product.deleteOne({ _id: productId }).then((product) => {
  return User.updateMany(
   { 'cart.items.product': productId },
   { $pull: { 'cart.items': { product: productId } } }
  );
 }).then((result) => {
  // console.log("file: admin.controller.js:98 ~ Product.deleteOne ~ result:", result);
  res.redirect('/admin/products');
 }).catch((error) => {
  console.log("file: admin.controller.js:100 ~ Product.deleteOne ~ error:", error);
 })
}