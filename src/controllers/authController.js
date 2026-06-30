const { User, Cart } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if(existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({ name, email, password});
        await Cart.create({ userId: newUser.id});

        return res.status(201).json ({ message: 'User has been registered successfully', user: { id: newUser.id, name: newUser.name, email: newUser.email} });

    }
    catch (error) {
        return res.status(500).json( { message: 'An error occurred while registering the user', error: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password} = req.body;
        const user = await User.findOne({ where: { email}});
        if(!user){
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email}, process.env.JWT_SECRET, { expiresIn: '12h'});
        return res.status(200).json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email}});
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred while logging in', error: error.message });
    }
}