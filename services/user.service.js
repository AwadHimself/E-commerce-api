const User = require("../models/userModel");
var slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const APIFeatures = require("../utils/apiFeatures");
const factory = require("./handlerFactory");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");

const { uploadSingleImage } = require("../middlewares/uploadImagesMiddleware");
const createToken = require("../utils/createToken");

//get list of Users
//@route GET /api/v1/users
//@access private
const getUsers = asyncHandler(async (req, res) => {
  //build Query
  const countDocuments = await User.countDocuments();
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(countDocuments);

  const { query, paginationResult } = features;

  const user = await query;
  res.status(200).json({ results: user.length, paginationResult, data: user });
});

//get User by id
//@route GET /api/v1/users/:id
//@access private
const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new apiError(`No user For This Id ${id}`, 404));
  }
  res.status(200).json({ data: user });
});

//Update User by id
//@route put /api/v1/users/:id
//@access private
const updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
    },
  );

  if (!document) {
    return next(new apiError(`No Document For This Id ${id}`, 404));
  }

  res.status(200).json({ data: document });
});

//change user password
//@route put /api/v1/users
//@access private

const changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );

  if (!document) {
    return next(new apiError(`No Document For This Id ${id}`, 404));
  }

  res.status(200).json({ data: document });
});

//create User
//@route POST /api/v1/users
//@access private
const createUser = factory.createOne(User);
//delete User
//@route DELETE /api/v1/users/:id
//@access private
const deleteUser = factory.deleteOne(User);

const uploadUserImage = uploadSingleImage("profileImage");

const resizeUserdImage = asyncHandler(async (req, res, next) => {
  const filename = `User-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(900, 900)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    req.body.profileImage = filename;
  }
  next();
});

//Get Logged  user data
//@route Get /api/v1/users/getme
//@access protect
const getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

//Update Logged user Password
//@route put /api/v1/users/updatemypassword
//@access protect
const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );

  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

//Update Logged user Data (without password & role)
//@route put /api/v1/users/updateme
//@access protect
const updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
    },
    {
      new: true,
    },
  );

  res.status(200).json({ data: updatedUser });
});

//Deactivate Logged User
//@route DELETE /api/v1/users/deleteme
//@access protect
const deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  const deletedUser = await User.findByIdAndUpdate(req.user._id, {
    active: false,
  });

  res.status(204).json({ status: "success" });
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
  uploadUserImage,
  resizeUserdImage,
  changeUserPassword,
  getMe,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
};
