const Review = require("../models/reviewModel");
const factory = require("./handlerFactory");

// Nested route
// GET /api/v1/products/:productId/reviews
const createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

//get list of Reviews
//@route GET /api/v1/reviews
//@access Public
const getReviews = factory.getAll(Review);

//get Review by id
//@route GET /api/v1/review/:id
//@access Public
const getReview = factory.getOne(Review);

//Update Brand by id
//@route put /api/v1/categories/:id
//@access private
const updateReview = factory.updateOne(Review);

// Nested route (Create)
const setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
//create Brand
//@route POST /api/v1/brands
//@access protect
const createReview = factory.createOne(Review);
//delete brand
//@route DELETE /api/v1/brands/:id
//@access private
const deleteReview = factory.deleteOne(Review);

module.exports = {
  getReviews,
  getReview,
  updateReview,
  createReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
};
