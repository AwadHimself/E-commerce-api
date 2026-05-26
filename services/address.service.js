const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");

//Add User Address
//@route POST /api/v1/addresses
//@access Protected(user)
const addUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true },
  );

  res.status(200).json({
    status: "success",
    msg: "Address Added Successfully ",
    data: user.addresses,
  });
});

//Remove User Address
//@route Delete /api/v1/adresses
//@access Protected(user)
const removeUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true },
  );

  res.status(200).json({
    status: "success",
    msg: "Address Removed Successfully",
    data: user.addresses,
  });
});

//Get Logged User Adresses
//@route Get /api/v1/wishlist
//@access Protected(user)
const getLoggedUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    status: "success",
    data: user.addresses,
  });
});

module.exports = {
  addUserAddress,
  removeUserAddress,
  getLoggedUserAddress,
};
