const jwt = require("jsonwebtoken");
const BlackList = require("../models").BlackList;

/**
 * @swagger
 * components:
 *   schemas:
 *     verifyTokenFailed:
*        type: object
*        properties:
*          message:
*            type: string
*            description: Не верный токен
*        example:
*          message: "Не верный токен"
 *     verifyTokenExist:
*        type: object
*        properties:
*          message:
*            type: string
*            description: Токен обязателен для авторизации
*        example:
*          message: "Токен обязателен для авторизации"
 */
const verifyToken = async (req, res, next) => {
    const bearerHeader = req.body.token || req.query.token || req.headers["authorization"];

    if (!bearerHeader) {
        return res.status(403).send("Токен обязателен для авторизации");
    }

    const token = bearerHeader.split(' ')[1];

    try {
        req.body = await jwt.verify(token, process.env.TOKEN_KEY);

        const ban = await BlackList.findOne({ where: { token } });

        if (ban) throw new Error();

        req.body.token = token;

    } catch (err) {
        
        return res.status(401).send("Не верный токен");
    }
    return next();
};

module.exports = verifyToken;