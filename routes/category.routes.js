const express = require("express");
const router = express.Router();
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../validators/categoryValidator");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
} = require("../services/category.service");

const { param, validationResult } = require("express-validator");

const subCategoriesRoute = require("./subCategory.routes");
router.use("/:categoryId/subcategories", subCategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory,
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory,
  )
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
