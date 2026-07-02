const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');


//endpoints
router.get('/', productController.getAllProducts);
router.post('/', authMiddleware, productController.createProduct);

module.exports = router;