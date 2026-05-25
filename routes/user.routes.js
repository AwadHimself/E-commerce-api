const express = require("express");

const router = express.Router();
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserPasswordValidator,
  updateLoggedUserValidator,
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
  getMe,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../services/user.service");

const { param, validationResult } = require("express-validator");
const { protect, allowedTo } = require("../services/auth.service");

router.put(
  "/changepassword/:id",
  changeUserPasswordValidator,
  changeUserPassword,
);

//USERS
router.get("/getme", protect, getMe, getUser);
router.put(
  "/updateme",
  protect,
  updateLoggedUserValidator,
  updateLoggedUserData,
);
router.put(
  "/updatemypassword",
  protect,
  updateLoggedUserPasswordValidator,
  updateLoggedUserPassword,
);
router.get("/deleteme", deleteLoggedUserData);

//Admin
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
