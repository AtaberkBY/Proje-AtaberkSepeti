require('dotenv').config();

const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { User, Product, Cart, CartItem, Order, OrderItem } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);


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
