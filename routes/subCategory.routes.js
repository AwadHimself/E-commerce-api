const express = require("express");

//mergeparams => access the params on other routes
const router = express.Router({ mergeParams: true });

const {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../services/subCategory.service");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../validators/subCategoryValidator");
const { protect, allowedTo } = require("../services/auth.service");

router
  .route("/")
  .get(getSubCategories)
  .post(
    protect,
    allowedTo("admin", "manger"),
    createSubCategoryValidator,
    createSubCategory,
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .post(
    protect,
    allowedTo("admin", "manger"),
    updateSubCategoryValidator,
    updateSubCategory,
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory,
  );

module.exports = router;
