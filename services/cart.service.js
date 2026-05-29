const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");

const calcTotalCartPrice = (cart) => {
  let totalCartPrice = 0;

  cart.cartItems.forEach((item) => {
    totalCartPrice += item.quantity * item.price;
  });

  cart.totalCartPrice = totalCartPrice;

  return totalCartPrice;
};

const calcTotalPriceAfterDiscount = (totalPrice, discount) => {
  return (totalPrice - (totalPrice * discount) / 100).toFixed(2);
};

// Add Product To Cart
// @route POST /api/v1/cart
// @access Protected(User)
const AddToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new apiError("Product Not Found", 404));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  // Create Cart
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  }

  // User Already Has Cart
  else {
    const productExistIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color,
    );

    // Product Exists
    if (productExistIndex > -1) {
      cart.cartItems[productExistIndex].quantity += 1;
    }

    // Product Doesn't Exist
    else {
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }

  // Recalculate Cart Price
  calcTotalCartPrice(cart);

  // Remove Applied Coupon After Cart Modification
  cart.totalCartPriceAfterDiscount = undefined;

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product Added To Cart Successfully",
    NumOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// Get Logged User Cart
// @route GET /api/v1/cart
// @access Protected(User)

const getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new apiError("This User Has No Cart", 404));
  }

  res.status(200).json({
    status: "success",
    NumOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// Clear Logged User Cart
// @route DELETE /api/v1/cart
// @access Protected(User)

const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({
    user: req.user._id,
  });

  if (!cart) {
    return next(new apiError("This User Has No Cart", 404));
  }

  res.status(204).send();
});

// Remove Specific Cart Item
// @route DELETE /api/v1/cart/:itemId
// @access Protected(User)

const removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        cartItems: { _id: req.params.itemId },
      },
    },
    { new: true },
  );

  if (!cart) {
    return next(new apiError("This User Has No Cart", 404));
  }

  // Recalculate Prices
  calcTotalCartPrice(cart);

  // Remove Coupon
  cart.totalCartPriceAfterDiscount = undefined;

  await cart.save();

  res.status(200).json({
    status: "success",
    NumOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// Update Cart Item Quantity
// @route PUT /api/v1/cart/:itemId
// @access Protected(User)

const UpdateItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    return next(new apiError("This User Has No Cart", 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId,
  );

  if (itemIndex === -1) {
    return next(new apiError("Cart Item Not Found", 404));
  }

  cart.cartItems[itemIndex].quantity = req.body.quantity;

  // Recalculate Prices
  calcTotalCartPrice(cart);

  // Remove Coupon
  cart.totalCartPriceAfterDiscount = undefined;

  await cart.save();

  res.status(200).json({
    status: "success",
    NumOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// Apply Coupon
// @route PUT /api/v1/applycoupon
// @access Protected(User)

const applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new apiError("Invalid Or Expired Coupon", 404));
  }

  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    return next(new apiError("This User Has No Cart", 404));
  }

  // Calculate Total Price
  const totalCartPrice = calcTotalCartPrice(cart);

  // Calculate Discounted Price
  cart.totalCartPriceAfterDiscount = calcTotalPriceAfterDiscount(
    totalCartPrice,
    coupon.discount,
  );

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
  clearCart,
  removeCartItem,
  UpdateItemQuantity,
  applyCoupon,
};
