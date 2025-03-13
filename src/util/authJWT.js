const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey'; // TODO: Change this to JWT secret key

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        
        req.user = user;
        next();
    });
};

module.exports = authenticateJWT;