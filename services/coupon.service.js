const Coupon = require("../models/couponModel");
const factory = require("./handlerFactory");

//get list of Coupons
//@route GET /api/v1/coupons
//@access private(admin&manger)
const getCoupons = factory.getAll(Coupon);

//get Coupon by id
//@route GET /api/v1/coupons/:id
//@access private(admin&manger)
const getCoupon = factory.getOne(Coupon);

//Update Coupon by id
//@route put /api/v1/coupons/:id
//@access private(admin&manger)
const updateCoupon = factory.updateOne(Coupon);
//create Coupon
//@route POST /api/v1/coupons
//@access private(admin&manger)
const createCoupon = factory.createOne(Coupon);
//delete Coupon
//@route DELETE /api/v1/coupons/:id
//@access private(admin&manger)
const deleteCoupon = factory.deleteOne(Coupon);

module.exports = {
  getCoupons,
  getCoupon,
  updateCoupon,
  createCoupon,
  deleteCoupon,
};
