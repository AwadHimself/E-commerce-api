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
const { allowedTo, protect } = require("../services/auth.service");
router.use("/:categoryId/subcategories", subCategoriesRoute);

router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    allowedTo("admin", "manger"),
    uploadBrandImage,
    resizeBrandImage,
    createBrandValidator,
    createBrand,
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    protect,
    allowedTo("admin", "manger"),
    updateBrandValidator,
    uploadBrandImage,
    resizeBrandImage,
    updateBrand,
  )
  .delete(protect, allowedTo("admin"), deleteBrandValidator, deleteBrand);

module.exports = router;
