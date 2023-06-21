const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD,
    },
});

const send = async (mailDetails, callback) => {
    try {
        const info = await transporter.sendMail(mailDetails)
        callback(info);
    } catch (error) {
        console.log(error);
    }
};

module.exports = send;