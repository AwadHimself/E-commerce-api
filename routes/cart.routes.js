const express = require("express");
const { protect, allowedTo } = require("../services/auth.service");
const {
  addToWishlistValidator,
  removeFromWishlistValidator,
} = require("../validators/addToWishlistValidator");
const {
  AddToCart,
  getLoggedUserCart,
  removeCartItem,
  clearCart,
  UpdateItemQuantity,
  applyCoupon,
} = require("../services/cart.service");
const router = express.Router();

router.use(protect, allowedTo("user"));

router.route("/").get(getLoggedUserCart).post(AddToCart).delete(clearCart);
router.route("/:itemId").delete(removeCartItem).put(UpdateItemQuantity);
router.route("/applycoupon").post(applyCoupon);

module.exports = router;
