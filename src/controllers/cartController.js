const { Cart, CartItem, Product } = require('../models');

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({
            where: { userId },
            include: [
                {
                    model: CartItem,
                    include: [{ model: Product, attributes: ['id', 'name', 'price', 'description']} ]
                }
            ]
        });

        if(!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        return res.status(200).json({ cart});
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity} = req.body;

        if(!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity provided' });
        }

        const product = await Product.findByPk(productId);
        if(!product) {
            return res.status(404).json({ message: 'The product you are trying to add does not exist' });
        }

        const cart = await Cart.findOne({ where: { userId}});
        let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId}});
        if(cartItem) {
            cartItem.quantity += parseInt(quantity);
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({ cartId: cart.id, productId, quantity});
        }

        return res.status(200).json({ message: 'Product added to cart successfully', cartItem});
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred while adding the product to the cart' });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItemId} = req.params;
        const { quantity} = req.body;

        if(!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity provided' });
        }

        const cartItem = await CartItem.findByPk(cartItemId, {include: [{ model: Cart}] });
        if(!cartItem || cartItem.Cart.userId !== userId){
            return res.status(404).json({ message: 'Cart item not found or does not belong to the user' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        return res.status(200).json({ message: 'Cart item updated successfully', quantity: cartItem.quantity});
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred while updating the cart item' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItemId} = req.params;

        const cartItem = await CartItem.findByPk(cartItemId, {include: [{ model: Cart}] });
        if(!cartItem || cartItem.Cart.userId !== userId){
            return res.status(404).json({ message: 'Cart item not found or does not belong to the user' });
        }

        await cartItem.destroy();
        return res.status(200).json({ message: 'Cart item removed successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred while removing the cart item' });
    }
};