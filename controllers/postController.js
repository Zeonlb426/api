
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const mailConfirmTemplate = require("../templates/mailConfirmTemplate");
const sendMail = require("../services/mailer");
const User = require("../models").User;
const BlackList = require("../models").BlackList;
const Media = require("../models").Media;
const Profile = require("../models").Profile;
const Post = require("../models").Post;
const { S3 } = require("@aws-sdk/client-s3");

exports.postCreate = async (req, res) => {


    if (req.files.length === 0) {
        return res.status(400).json({"message":"Файлы отсутствуют"});
    }

    const post = await Post.create({
        description: req.body.description,
        userId: req.tokenPayload.userId
    });

    req.files.forEach(async file => {
        await Media.create({
            "model": 'Post',
            "modelId": post.id,
            "type": file.mimetype,
            "size": file.size,
            "fieldname": file.fieldname,
            "path": file.key
        });
    });

    
    // console.log(req.files);
    // console.log("------------------------------------------");
    // console.log(req.body.description);

    return res.status(200).json({"message": "Успех"});
};
