
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


exports.create = async (req, res) => {

    const { firstName, lastName, email, password } = req.body;

    const oldUser = await User.findOne({ where: {email} });

    if (oldUser) return res.status(409).json({"message": "Такой пользователь уже существует"});

    let encryptedPassword = await bcrypt.hash(password, 5);

    const user = await User.create({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
    });

    const token = jwt.sign(
        { id: user.id, email },
        process.env.TOKEN_KEY,
        {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
        }
    );
    // save user token
    user.token = token;
    await user.save({ fields: ['token'] });

    // return new user
    return res.status(201).json(user);
};

exports.update = async (req, res) => {
    return res.send("NOT IMPLEMENTED: Site Home Page");
};

exports.delete = async (req, res) => {
    return res.send("NOT IMPLEMENTED: Site Home Page");
};