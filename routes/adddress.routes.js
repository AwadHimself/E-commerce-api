const express = require("express");
const { protect, allowedTo } = require("../services/auth.service");
const {
  addToWishlistValidator,
  removeFromWishlistValidator,
} = require("../validators/addToWishlistValidator");
const {
  getLoggedUserAddress,
  addUserAddress,
  removeUserAddress,
} = require("../services/address.service");
const router = express.Router();

router.use(protect, allowedTo("user"));

router.route("/").get(getLoggedUserAddress).post(addUserAddress);

router.route("/:addressId").delete(removeUserAddress);

module.exports = router;
