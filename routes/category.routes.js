const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/category.service");

router.get("/", getCategories).post("/", createCategory);
router
  .get("/:id", getCategory)
  .put("/:id", updateCategory)
  .delete("/:id", deleteCategory);

module.exports = router;
