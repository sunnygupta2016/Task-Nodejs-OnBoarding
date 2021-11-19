const router = require("express").Router();
const Controller = require("../Controllers");
const { authenticate: Auth } = require("../../common");

router.post("/register",Controller.UserController.register);
router.post("/login", Controller.UserController.login);
router.post("/changePassword", Auth.verifyUser, Controller.UserController.changePassword);

router.post("/forgotPassword", Controller.UserController.sendOtpForgot);
router.post("/verifyOtp", Controller.UserController.verifyOtp);
router.post("/resetPassword", Auth.verifyUser, Controller.UserController.resetPassword);
module.exports = router;