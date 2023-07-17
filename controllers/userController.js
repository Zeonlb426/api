
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const mailConfirmTemplate = require("../templates/mailConfirmTemplate");
const sendMail = require("../services/mailer");
const User = require("../models").User;
const BlackList = require("../models").BlackList;
const Media = require("../models").Media;
const Profile = require("../models").Profile;

exports.update = async (req, res) => {

    const {
        firstName,
        lastName,
        oldPassword,
        newPassword,
        phone,
        description,
        latitude,
        longitude,
        commercial
    } = req.body;

    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) return res.status(409).json({ "message": "Такой пользователь не существует" });

    const userUpdateData = {};

    if (firstName !== user.firstName) {
        userUpdateData.firstName = firstName
    }

    if (lastName !== user.lastName) {
        userUpdateData.lastName = lastName
    }

    if (
        newPassword
        && newPassword.length > 0
        && oldPassword
        && oldPassword.length > 0
        ) {
            const validPassword = await bcrypt.compare(oldPassword, user.password);

            if (validPassword) {
                const password = await bcrypt.hash(newPassword, 5);
                userUpdateData.password = password;
            }
    }

    if (Object.keys(userUpdateData).length !== 0 ) {
        await User.update(userUpdateData, {
            where: {
              id: req.user.id
            }
        });
    }

    // Profile -------------------------------------
    const modelProfile = await Profile.findOne({ where: { userId: user.id } });

    if (modelProfile) {
        modelProfile.set({
            phone,
            description,
            latitude: latitude ? latitude : modelProfile.latitude,
            longitude: longitude ? longitude : modelProfile.longitude,
            commercial: !!commercial,
        })
        await modelProfile.save();
    }else{
        const newModelProfile = Profile.build({
            userId: user.id,
            phone,
            description,
            latitude: latitude ? latitude : null,
            longitude: longitude ? longitude : null,
            commercial: !!commercial,
        });

        await newModelProfile.save();
    }
    

    return res.status(200).json({"message":"update"});
};


exports.avatar = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({"message":"Файл пуст"});
    }

    const media = await Media.create({
        "model": 'User',
        "modelId": req.tokenPayload.userId,
        "type": req.file.mimetype,
        "size": req.file.size,
        "fieldname": req.file.fieldname,
        "path": req.file.key
    });

    return res.status(200).json({"message":"Файл сожранен"});
};


exports.profile = async (req, res) => {

    // const avatar = await Media.findOne({
    //     where: {
    //         model: 'User',
    //         modelId: user.id,
    //         fieldname: 'avatar'
    //     }
    // })
    // const pathToAvatar = avatar.getDataValue('path') ? `https://instagram.lern.dev/storage/${avatar.dataValues.path}` : '';

    return res.status(200).json({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        avatar: req.user.avatar
    });
};
