require('dotenv').config();

const express = require('express');
const sequelize = require('./config/database');

const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


const SyncDatabase = async () => {
    try {
        await sequelize.authenticate();;
        console.log('Database connection has been established successfully.');

        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });

    }
    catch  (err) {
        console.error('Error syncing database:', err);
    }
}




SyncDatabase();