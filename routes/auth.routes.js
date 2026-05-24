const express = require("express");

const router = express.Router();
const {
  signUpValidator,
  loginValidator,
} = require("../validators/authValidator");

const { signUp, login } = require("../services/auth.service");

const { param, validationResult } = require("express-validator");

router.route("/signup").post(signUpValidator, signUp);
router.route("/login").post(loginValidator, login);

// router
//   .route("/:id")
//   .get(getUser)
//   .put(uploadUserImage, resizeUserdImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
