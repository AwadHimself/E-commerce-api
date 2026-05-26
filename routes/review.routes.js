const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getReviews,
  getReview,
  updateReview,
  createReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require("../services/review.service");

const { param, validationResult } = require("express-validator");

const { allowedTo, protect } = require("../services/auth.service");
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
} = require("../validators/reviewValidator");

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    protect,
    allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview,
  );

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo("user", "manger", "admin"),
    deleteReviewValidator,
    deleteReview,
  );

module.exports = router;
