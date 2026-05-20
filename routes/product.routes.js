const express = require("express");

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

router
  .route("/")
  .get(getProducts)
  .post(
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct,
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
