const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const auth = require("../middlewares/auth");
const validationRequest = require('../requests/validationRequest');

const router = express.Router()

router.get("/user", auth, userController.index);
router.post("/logout", auth, userController.create);

/**
* @swagger
* tags:
*   name: Auth
*   description: API для регистрации, аутентификации и авторизации пользователя
* /register:
*   post:
*     summary: Начало процедуры создания пользователя, проверка данных и отправка письма с подтверждением
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/registerRequest'
*     responses:
*       201:
*         description: Пользователь создан.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/userModel'
*       400:
*         description: Ошибка валидации данных.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errors:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       type:
*                         type: string
*                         description: Тип поля
*                       value:
*                         type: string
*                         description: Значение поля
*                       msg:
*                         type: string
*                         description: Текст ошибки
*                       path:
*                         type: string
*                         description: Имя поля с ошибкой
*                       location:
*                         type: string
*                         description: Место, где произошла ошибка
*                     example:
*                       type: "field"
*                       value: "1234577777"
*                       msg: "Пароль должен быть не меньше 5 и не больше 8 символов"
*                       path: "password"
*                       location: "body"
*       409:
*         description: Пользователь с такими данными уже существует.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Текст ошибки
*               example:
*                 message: "Такой пользователь уже существует"
*       500:
*         description: Что-то пошло не так.. гы гы
*
*/
router.post("/register", validationRequest.register, userController.register);

/**
* @swagger
* /confirm:
*   get:
*     summary: Завершение процедуры создания пользователя, запись данных в базу
*     tags: [Auth]
*     parameters:
*       - in: query
*         name: tkey
*         type: string
*         required: true
*         description: Токен из письма подтверждения процедуры регистрации, время жизни 15 мин
*     responses:
*       201:
*         description: Пользователь создан.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/userModel'
*       500:
*         description: Что-то пошло не так.. гы гы
*
*/
router.get("/confirm", validationRequest.confirm, userController.create);

router.post("/login", authController.login);

router.get("/", userController.index);

module.exports = router