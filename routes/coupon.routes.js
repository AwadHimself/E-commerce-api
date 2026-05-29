const express = require("express");
const router = express.Router();

const {
  getCoupons,
  getCoupon,
  updateCoupon,
  createCoupon,
  deleteCoupon,
} = require("../services/coupon.service");
const { protect, allowedTo } = require("../services/auth.service");

router.use(protect, allowedTo("admin", "manger"));

router.route("/").get(getCoupons).post(createCoupon);

router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
