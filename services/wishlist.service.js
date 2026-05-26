const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");

//Add Product TO Wishlist
//@route POST /api/v1/wishlist
//@access Protected(user)
const addProductToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true },
  );

  res.status(200).json({
    status: "success",
    msg: "Product Added Successfully To Your Wishlist",
    data: user.wishlist,
  });
});

//Remove Product TO Wishlist
//@route Delete /api/v1/wishlist
//@access Protected(user)
const removeProductToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true },
  );

  res.status(200).json({
    status: "success",
    msg: "Product Removed Successfully To Your Wishlist",
    data: user.wishlist,
  });
});

//Get Logged User Wishlist
//@route Get /api/v1/wishlist
//@access Protected(user)
const getLoggedUserWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "success",
    data: user.wishlist,
  });
});

module.exports = {
  addProductToWishlist,
  removeProductToWishlist,
  getLoggedUserWishlist,
};
