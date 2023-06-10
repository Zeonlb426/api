const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const auth = require("../middleware/auth");

const router = express.Router()

router.get("/", auth, userController.index);
router.post("/logout", auth, userController.create);

router.post("/register", userController.create);
router.post("/login", authController.login);

module.exports = router