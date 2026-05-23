const express = require("express");

const router = express.Router();
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../validators/userValidator");

const {
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
  changeUserPassword,
  uploadUserImage,
  resizeUserdImage,
} = require("../services/user.service");

const { param, validationResult } = require("express-validator");

router.put(
  "/changepassword/:id",
  changeUserPasswordValidator,
  changeUserPassword,
);

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeUserdImage, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUser)
  .put(uploadUserImage, resizeUserdImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
