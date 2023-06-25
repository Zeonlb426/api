const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("Токен обязателен для авторизации");
    }
    try {
        req.body.user = jwt.verify(token, process.env.TOKEN_KEY);
    } catch (err) {
        return res.status(401).send("Не верный токен");
    }
    return next();
};

module.exports = verifyToken;