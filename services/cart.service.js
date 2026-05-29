const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const APIFeatures = require("../utils/apiFeatures");

const calcTotalCartPrice = (cart) => {
  // calc the total cart price
  let cartPrice = 0;
  cart.cartItems.forEach((item) => {
    cartPrice += item.quantity * item.price;
  });

  return cartPrice;
};

//Add Product TO Cart
//@route POST /api/v1/cart
//@access protect(user)
const AddToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  const cart = await Cart.findOne({ user: req.user._id });

  //if the user has o cart
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color: color, price: product.price }],
    });
  }
  //if the user has a cart
  else {
    //if the user has the same prodcut w the same color in the cart the quantity will be increased by 1
    const productExistIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color,
    );
    if (productExistIndex > -1) {
      const cartItem = cart.cartItems[productExistIndex];
      cartItem.quantity += 1;
      cart.cartItems[productExistIndex] = cartItem;
    }
    //the product doesn't exisit in this cart will add it to the cart
    else {
      cart.cartItems.push({
        product: productId,
        color: color,
        price: product.price,
      });
    }
  }

  cart.totalCartPrice = calcTotalCartPrice(cart);

  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Product Added To Cart Succesfully",
    data: cart,
  });
});

//Get Logged User Cart
//@route GET /api/v1/cart
//@access protect(user)
const getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new apiError("This User Has No Cart..", 404));
  }

  res.status(200).json({
    status: "success",
    NumOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//Clear Logged User Cart
// //@route GET /api/v1/cart
//@access protect(user)
const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  if (!cart) {
    return next(new apiError("This User Has No Cart..", 404));
  }
  res.status(204).send();
});

//Remove A Product From The Cart
// //@route DELETE /api/v1/cart/:itemId
//@access protect(user)
const removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true },
  );

  if (!cart) {
    return next(new apiError("This User Has No Cart..", 404));
  }

  cart.totalCartPrice = calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    NumOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//Upadte CartItem quantity
// //@route PUT /api/v1/cart/:itemId
//@access protect(user)
const UpdateItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new apiError("This User Has No Cart..", 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId,
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = req.body.quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(new apiError("Cart Item Not Found", 404));
  }

  cart.totalCartPrice = calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    NumOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//Apply Coupon On Logged User Cart
// //@route PUT /api/v1/applycoupon
//@access protect(user)
const applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new apiError("Invalid Or Expired Coupon", 404));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new apiError("This User Has No Cart..", 404));
  }

  const totalCartPrice = calcTotalCartPrice(cart);
  const totalCartPriceAfterDiscount = (
    (totalCartPrice * coupon.discount) /
    100
  ).toFixed(2);

  cart.totalCartPriceAfterDiscount = totalCartPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    NumOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

module.exports = {
  AddToCart,
  getLoggedUserCart,
  removeCartItem,
  clearCart,
  UpdateItemQuantity,
  applyCoupon,
};
