const express = require("express");
const reviweRoute = require("./review.routes");

const router = express.Router();
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../validators/productValidator");

const {
  getProducts,
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/Product.service");

const { param, validationResult } = require("express-validator");
const { protect, allowedTo } = require("../services/auth.service");

router.use("/:productId/reviews", reviweRoute);

router.route("/").get(getProducts).post(
  protect,
  allowedTo("admin", "manger"),

  uploadProductImages,
  resizeProductImages,
  createProductValidator,
  createProduct,
);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    protect,
    allowedTo("admin", "manger"),

    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
