
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const mailConfirmTemplate = require("../templates/mailConfirmTemplate");
const sendMail = require("../services/mailer");
const User = require("../models").User;
const BlackList = require("../models").BlackList;
const Media = require("../models").Media;

exports.update = async (req, res) => {
    
    console.log(req.body);

    return res.status(200).json({"message":"update"});
};


exports.avatar = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({"message":"Файл пуст"});
    }

    const media = await Media.create({
        "model": 'User',
        "modelId": req.user.id,
        "type": req.file.mimetype,
        "size": req.file.size,
        "fieldname": req.file.fieldname,
        "path": req.file.key
    });

    return res.status(200).json({"message":"Файл сожранен"});
};


exports.profile = async (req, res) => {

    return res.status(200).json({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        avatar: req.user.avatar
    });
};
