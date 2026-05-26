const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const Product = require("../models/productModel");

exports.addToWishlistValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid Product id format")
    .custom(async (val) => {
      const product = await Product.findById(val);

      if (!product) {
        throw new Error(`No product found for this id ${val}`);
      }

      return true;
    }),

  validatorMiddleware,
];

exports.removeFromWishlistValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid Product id format")
    .custom(async (val) => {
      const product = await Product.findById(val);

      if (!product) {
        throw new Error(`No product found for this id ${val}`);
      }

      return true;
    }),

  validatorMiddleware,
];
