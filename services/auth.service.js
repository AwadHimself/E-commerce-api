const User = require("../models/userModel");

const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Sign Up
//@route GET /api/v1/auth/signup
//@access Public
const signUp = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  res.status(201).json({ data: user, token });
});

//login
//@route post /api/v1/auth/login
//@access Public
const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new apiError("Incorrect Email Or Password", 401));
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  res.status(200).json({ data: user, token });
});

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // get the token if exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // if no token
  if (!token) {
    return next(
      new apiError(
        "You Are Not Logged In.., Please Login To Access This Route ",
        401,
      ),
    );
  }

  // verify the token if valid
  const { userId, iat } = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //check the user
  const currentUser = await User.findById(userId);
  if (!currentUser) next(new apiError("This User IS No Longer Exist", 401));

  if (currentUser.passwordChangedAt) {
    const passwordChangedStmap = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    //password changed after the token was generated
    if (passwordChangedStmap > iat) {
      return next(
        new apiError(
          "The Password For This User Is Changed, Please Login Again",
          401,
        ),
      );
    }
  }
  req.user = currentUser;
  next();
});

//  Authorization (User Permisssions)
const allowedTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new apiError("You Are Not Allowed To Access This Route", 403),
      );
    }
    next();
  });
};

module.exports = { signUp, login, protect, allowedTo };
