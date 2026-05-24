const crypto = require("crypto");

const User = require("../models/userModel");
const apiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

//Sign Up
//@route POST /api/v1/auth/forgotpassword
//@access Public
const forgetpassword = asyncHandler(async (req, res, next) => {
  //get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) next(new apiError("There is no user for this email", 404));

  //generate random pin
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  //save the hashed code into the db
  user.passwordResetCode = hashedResetCode;
  //expiratio time (10min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code (Valid To 10 Mins)",
      message: message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new apiError("There is an error in seding the mail", 500));
  }
  res
    .status(200)
    .json({ status: "success", message: "Reset Code Sent To Email" });
});

//verify Reset Code
//@route POST /api/v1/auth/verifyresetcode
//@access Public
const verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) next(new apiError("Reset Code Is Invaild Or Expired"));

  user.passwordResetVerified = true;

  await user.save();

  res.status(200).json({ status: "success" });
});

//reset password
//@route POST /api/v1/auth/resetpassword
//@access Public

const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    next(new apiError("There Is No User For This Email", 404));
  }
  if (!user.passwordResetVerified) {
    next(new apiError("Reset Code Is Not Verifed", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  res.status(200).json({ status: "success", token: token });
});

module.exports = { forgetpassword, verifyResetCode, resetPassword };
