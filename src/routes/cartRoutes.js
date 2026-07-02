const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware authentication
router.use(authMiddleware);

//endpoints
router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/item/:cartItemId', cartController.updateCartItem);
router.delete('/item/:cartItemId', cartController.removeFromCart);

module.exports = router;