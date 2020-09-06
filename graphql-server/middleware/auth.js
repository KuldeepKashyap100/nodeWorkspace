const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.get('Authorization') && req.get('Authorization').split(' ')[1];
    if(!token) {
        req.auth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'someSecretString');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken) {
        req.auth = false;
        return  next();
    }
    req.userId = decodedToken.userId;
    req.auth = true;
    next();
};