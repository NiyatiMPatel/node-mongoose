import path from 'path'
import rootDir from '../util/path'
import Product from "../models/product.model";
import Order from "../models/order.model"

// SHOP GET INDEX
export const getShopIndexProducts = (req, res, next) => {
 Product.find().then((product) => {
  // console.log("file: customer.controller.js:8 ~ Product.find ~ product:", product);
  res.render(path.join(rootDir, 'views', 'customer', 'index.ejs'), {
   prods: product,
   pageTitle: 'Shop',
   path: '/',
  });
 }).catch((err) => {
  console.log("file: customer.controller.js:15 ~ Product.find ~ err:", err);
 })

}

// SHOP GET PRODUCTS
export const getShopProducts = (req, res, next) => {
 Product.find().then((product) => {
  // console.log("file: customer.controller.js:23 ~ Product.find ~ product:", product);
  res.render(path.join(rootDir, 'views', 'customer', 'products-list.ejs'), {
   prods: product,
   pageTitle: 'Products',
   path: '/products',
  });
 }).catch((err) => {
  console.log("file: customer.controller.js:30 ~ Product.find ~ err:", err);
 })
}

// SHOP GET SINGLE PRODUCT
export const getShopSingleProduct = (req, res, next) => {
 const { id } = req.params
 Product.findById(id).then((product) => {
  // console.log("file: customer.controller.js:38 ~ Product.findById ~ product:", product);
  res.render(path.join(rootDir, 'views', 'customer', 'product-detail.ejs'), {
   prods: product,
   pageTitle: product.title,
   path: '/products',  // FOR NAVIGATION MENU ITEMS TO BE HIGHLIGHTED/SHOWN ACTIVE
  });
 }).catch((err) => {
  console.log("file: customer.controller.js:45 ~ Product.findById ~ err:", err);
 })
}

// // ================================================ //

// ADD TO CART -- POST
export const postCart = (req, res, next) => {
 const { productId } = req.body;
 Product.findById(productId).then((product) => {
  return req.user.addToCart(product)
 }).then((result) => {
  // console.log("file: customer.controller.js:57 ~ Product.findById ~ result:", result);
  res.redirect('/cart')
 }).catch((err) => {
  console.log("file: customer.controller.js:60 ~ Product.findById ~ err:", err);
 })
}

// GET CARTS
export const getCart = (req, res, next) => {
 // POPULATE TELLS MONGOOSE TO POPULATE A CERTAIN FIELD WILTH ALL DETAIL INFORMATION INSTEAD OF JUST ID
 req.user.populate('cart.items.product').then((user) => {
  // console.log("file: customer.controller.js:67 ~ req.user.populate ~ products:", user.cart.items);
  res.render(path.join(rootDir, 'views', 'customer', 'cart.ejs'), {
   path: '/cart',
   pageTitle: 'Your Cart',
   prods: user.cart.items
  })
 }).catch((err) => {
  console.log("file: customer.controller.js:74 ~ req.user.populate ~ err:", err);
 })
}

// DELETE CART ITEM
export const postCartDeleteProduct = (req, res, next) => {
 const { productId } = req.body;
 return req.user.deleteCartItem(productId).then((product) => {
  // console.log("file: customer.controller.js:83 ~ returnreq.user.deleteCartItem ~ product:", product);
  res.redirect('/cart')
 }).catch((err) => {
  console.log("file: customer.controller.js:86 ~ returnreq.user.deleteCartItem ~ err:", err);
 })
}

// // ============================================================//

// POST ORDER
export const postOrder = (req, res, next) => {
 // POPULATE TELLS MONGOOSE TO POPULATE A CERTAIN FIELD WILTH ALL DETAIL INFORMATION INSTEAD OF JUST ID
 req.user.populate('cart.items.product').then((user) => {
  // console.log("file: customer.controller.js:93 ~ req.user.addOrder ~ user:", user);
  const products = user.cart.items.map((item) => {
   return {
    product: { ...item.product._doc }, // ._doc GIVES ACCESS TO JUST DATA WITHOUT METADATA; PULL OUT ALL THE DATA IN THAT DOCUMENT, STORE IT IN A NEW OBJECT
    quantity: item.quantity,
   }
  });
  const order = new Order({
   products: products,
   user: {
    name: req.user.name,
    userId: req.user //MONGOOSE WIL AUTOMATICALLY SAVE JUST THE ID EVEN IF WHOLE USER OBJECT IS PASSED TO userId
   }
  });
  return order.save()
 }).then((result) => {
  // console.log("file: customer.controller.js:113 ~ req.user.populate ~ result:", result);
  return req.user.clearCart();
 }).then(() => {
  res.redirect('/orders')
 }).catch((err) => {
  console.log("file: customer.controller.js:96 ~ req.user.addOrder ~ err:", err);
 })
}

// GET ORDERS
export const getOrders = (req, res, next) => {
 Order.find({ 'user.userId': req.user._id }).then((orders) => {
  // console.log("file: customer.controller.js:125 ~ Order.find ~ orders:", orders);
  res.render(path.join(rootDir, 'views', 'customer', 'orders.ejs'), {
   path: '/orders',
   pageTitle: 'Your Order',
   orders: orders
  })
 }).catch((err) => {
  console.log("file: customer.controller.js:107 ~ Order.find ~ err:", err);
 })
}