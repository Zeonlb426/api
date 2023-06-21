
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models")
const User = db.User;

exports.index = async (req, res) => {
    res.status(200).json(
        {
            "message": process.env.API_PORT,
            "status": "ok!"
        }
    );
};

exports.register = async (req, res) => {

    const { firstName, lastName, email, password } = req.body;

    const oldUser = await User.findOne({ where: { email } });

    if (oldUser) return res.status(409).json({ "message": "Такой пользователь уже существует" });

    // Время жизни токена 15 мин, только для проверки письма
    const token = jwt.sign(
        { firstName, lastName, email, password },
        process.env.TOKEN_KEY,
        {
            expiresIn: 15 * 60 * 1000,
        }
    );

    const mailTemplate = require("../templates/verificationMailTemplate");
    const send = require("../services/mailer"); 

    const message = `<a href="https://instagram.lern.dev/api/v1/confirm?tkey=${token}">Для завершения регистрации, пожалуйста пройдите по ссылке</a>`;
    const data = {
        userName: firstName + ' ' + lastName,
        text: message
    }
    const options = {
        from: "TESTING <zeonlb426@gmail.com>",
        to: "zeonlb426@gmail.com",
        subject: "Регистрация аккаунта в приложении Instagram",
        text: message,
        html: mailTemplate(data),
    }

    send(options, (info) => {
        console.log("Email sent successfully");
        console.log("MESSAGE ID: ", info.messageId);
    });

    return res.status(200).json({ "message": "Письмо отправлено" });
};

exports.create = async (req, res) => {

    const { firstName, lastName, email, password } = req.user;

    let encryptedPassword = await bcrypt.hash(password, 5);

    const user = await User.create({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
        verifyEmail: true,
    });

    const token = jwt.sign(
        { id: user.id, email },
        process.env.TOKEN_KEY,
        {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
        }
    );

    user.token = token;

    return res.status(201).json(user);
};

exports.update = async (req, res) => {
    return res.send("NOT IMPLEMENTED: Site Home Page");
};

exports.delete = async (req, res) => {
    return res.send("NOT IMPLEMENTED: Site Home Page");
};