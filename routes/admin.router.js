import express from 'express';

import { getEditAdminProduct, getAdminAddProduct, getAdminProducts, postAdminAddProduct, postAdminUpdatedProduct, deleteAdminProduct } from '../controllers/admin.controller';

const router = express.Router()


//  GET ADD PRODUCT VIEW

// GET ADD PRODUCT FORM/PAGE
router.get('/add-product', getAdminAddProduct);

// CREATE NEW PRODUCT
router.post('/add-product', postAdminAddProduct);

// // GET PRODUCTS LIST
router.get('/products', getAdminProducts);

// GET EDIT ADMIN SINGLE PRODUCT FORM/PAGE
router.get('/edit-product/:id', getEditAdminProduct);

// POST EDIT ADMIN SINGLE PRODUCT 
router.post('/edit-product', postAdminUpdatedProduct);

// DELETE ADMIN SINGLE PRODUCT 
router.post('/delete-product', deleteAdminProduct);


export default router;