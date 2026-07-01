const { User, Cart } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 



const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email}, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m'});
}

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email}, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d'});
}


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

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ message: 'Login successful', accessToken, user: { id: user.id, name: user.name, email: user.email}});
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred while logging in', error: error.message });
    }
}

exports.refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        const user = await User.findByPk(decoded.id);
        if(!user || user.refreshToken !== refreshToken){
            return res.status(403).json({ message: 'Token validation failed' });
        }

        const newAccessToken = generateAccessToken(user);
        return res.status(200).json({ accessToken: newAccessToken });
        
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred while refreshing the access token', error: error.message});
    }
}