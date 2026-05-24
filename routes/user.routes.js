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
const { protect, allowedTo } = require("../services/auth.service");

router.put(
  "/changepassword/:id",
  changeUserPasswordValidator,
  changeUserPassword,
);

router
  .route("/")
  .get(protect, allowedTo("admin"), getUsers)
  .post(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeUserdImage,
    createUserValidator,
    createUser,
  );

router
  .route("/:id")
  .get(protect, allowedTo("admin"), getUser)
  .put(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeUserdImage,
    updateUserValidator,
    updateUser,
  )
  .delete(protect, allowedTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
