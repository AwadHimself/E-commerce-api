const express = require("express");
const {
  addProductToWishlist,
  removeProductToWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlist.service");
const { protect, allowedTo } = require("../services/auth.service");
const {
  addToWishlistValidator,
  removeFromWishlistValidator,
} = require("../validators/addToWishlistValidator");
const router = express.Router();

router.use(protect, allowedTo("user"));

router
  .route("/")
  .get(getLoggedUserWishlist)
  .post(addToWishlistValidator, addProductToWishlist);

router
  .route("/:productId")
  .delete(removeFromWishlistValidator, removeProductToWishlist);

module.exports = router;
