const express = require("express");
const router = express.Router();
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../validators/brandValidator");

const {
  getBrands,
  getBrand,
  updateBrand,
  createBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
} = require("../services/brand.service");

const { param, validationResult } = require("express-validator");

const subCategoriesRoute = require("./subCategory.routes");
router.use("/:categoryId/subcategories", subCategoriesRoute);

router
  .route("/")
  .get(getBrands)
  .post(createBrandValidator, uploadBrandImage, resizeBrandImage, createBrand);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(updateBrandValidator, uploadBrandImage, resizeBrandImage, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
