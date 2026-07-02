const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization has been denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findByPk(decoded.id);
        if(!user) {
            return res.status(401).json({ message: 'There is no user associated with this token. Authorization has been denied.' });
        }

        req.user = {
            id: user.id,
            email: user.email
        };

        next(); // Proceed to the next middleware, route handler or controller

    }
    catch (error) {
        if(error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired. Please log in again.', code: 'TOKEN_EXPIRED' });
        }
        return res.status(401).json({ message: 'Invalid token. Authorization has been denied.', error: error.message });
    }
};

module.exports = authMiddleware;