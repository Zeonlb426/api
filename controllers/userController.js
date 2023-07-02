
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const mailConfirmTemplate = require("../templates/mailConfirmTemplate");
const sendMail = require("../services/mailer");
const User = require("../models").User;
const BlackList = require("../models").BlackList;





exports.update = async (req, res) => {
    console.log(req.body);

    return res.status(401).json({"message":"update"});
};

exports.avatar = async (req, res) => {

    /* 
        req.file = { 
            fieldname, originalname, 
            mimetype, size, bucket, key, location
        }
    */
    console.log(`req.files ->> `, req.file);
    // location key in req.file holds the s3 url for the image
    let data = {}
    if(req.file) {
        data.image = req.file.location
    }

    // HERE IS YOUR LOGIC TO UPDATE THE DATA IN DATABASE

    return res.status(401).json({"message":"avatar"});
};


