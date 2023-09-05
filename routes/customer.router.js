import express from 'express';
import {
 getShopIndexProducts, getShopProducts, getCart, getOrders, getShopSingleProduct, postCart, postCartDeleteProduct, postOrder
} from '../controllers/customer.controller';


const router = express.Router()

// GET SHOP INDEX/ FIRST PAGE
router.get('/', getShopIndexProducts);

// GET SHOP PRODUCTS LIST PAGE
router.get('/products', getShopProducts);

// GET SHOP SINGLE PRODUCTDETAIL PAGE
router.get('/product/:id', getShopSingleProduct);

// POST CART
router.post('/cart', postCart);

// GET CARTS
router.get('/cart', getCart);

// DELETE CART ITEM
router.post('/cart-delete-item', postCartDeleteProduct);

// POST ORDER
router.post('/create-order', postOrder);

// GET ORDERS
router.get('/orders', getOrders);


export default router;