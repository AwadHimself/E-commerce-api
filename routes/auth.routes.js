const express = require("express");

const router = express.Router();
const {
  signUpValidator,
  loginValidator,
} = require("../validators/authValidator");

const { signUp, login } = require("../services/auth.service");

const { param, validationResult } = require("express-validator");
const {
  forgetpassword,
  verifyResetCode,
  resetPassword,
} = require("../services/forgetpassword.service");

router.route("/signup").post(signUpValidator, signUp);
router.route("/login").post(loginValidator, login);
router.route("/forgotpassword").post(forgetpassword);
router.route("/verifyresetcode").post(verifyResetCode);
router.route("/resetpassword").put(resetPassword);

module.exports = router;
