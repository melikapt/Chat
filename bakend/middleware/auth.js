const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.header('auth-token');
        if(!token) return res.status(401).send('Unauthorized');

        const decoded = jwt.verify(token, '123456');
        req.user=decoded;

        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
}