const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const Review = require("../models/reviewModel");

exports.createReviewValidator = [
  check("title").optional(),

  check("ratings")
    .notEmpty()
    .withMessage("Rating Is Required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),

  check("user").isMongoId().withMessage("Invalid User Id"),

  check("product")
    .isMongoId()
    .withMessage("Invalid Product Id")
    .custom(async (val, { req }) => {
      const existingReview = await Review.findOne({
        user: req.user._id,
        product: val,
      });

      if (existingReview) {
        throw new Error("You already reviewed this product before");
      }

      return true;
    }),

  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);

      if (!review) {
        throw new Error(`There is no review with id ${val}`);
      }

      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error("You are not allowed to perform this action");
      }

      return true;
    }),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);

      if (!review) {
        throw new Error(`There is no review with id ${val}`);
      }

      if (req.user.role === "user") {
        if (review.user._id.toString() !== req.user._id.toString()) {
          throw new Error("You are not allowed to perform this action");
        }
      }

      return true;
    }),

  validatorMiddleware,
];
