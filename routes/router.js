const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const auth = require("../middlewares/auth");
const validationRequest = require('../requests/validationRequest');

const router = express.Router()

router.get("/user", auth, userController.index);
router.post("/logout", auth, userController.create);

router.post("/register", validationRequest.request, userController.create);
router.post("/login", authController.login);

router.get("/", userController.index);

module.exports = router