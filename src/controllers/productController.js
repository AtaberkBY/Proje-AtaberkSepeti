const { Product } = require('../models');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).json({ products });
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred while fetching products', error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, stock} = req.body;

        if(!name || !price || stock === undefined) {
            return res.status(400).json({ message: 'Name, price, and stock are required fields' });
        }

        if(price < 0 || stock < 0 ) {
            return res.status(400).json({ message: 'Price and stock must be non-negative values' });
        }

        const newProduct = await Product.create({
            name,
            price,
            description,
            stock
        });

        return res.status(201).json({ message: 'Product created successfully', product: newProduct });
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred while creating the product', error: error.message });
    }
}