var slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");

const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");

//get list of subCategories
//@route GET /api/v1/subcategories
//@access Public
const getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  let filterObj = {};
  if (req.params.categoryId) filterObj = { category: req.params.categoryId };

  const subCategories = await SubCategory.find(filterObj)
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name , id" });
  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

//get subCategory by id
//@route GET /api/v1/subcategories/:id
//@access Public
const getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id).populate({
    path: "category",
    select: "name , id",
  });
  if (!subCategory) {
    return next(new apiError(`No SubCategory For This Id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

//create subCategory
//@route POST /api/v1/subcategories
//@access private
const mongoose = require("mongoose");

const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;

  console.log(category);

  // Validate ObjectId first
  if (!mongoose.Types.ObjectId.isValid(category)) {
    return next(new apiError(`Invalid Category Id: ${category}`, 400));
  }

  // Check if category exists
  const foundCategory = await Category.findById(category);

  if (!foundCategory) {
    return next(new apiError(`No Category For This Id ${category}`, 404));
  }

  // Create subcategory
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(201).json({ data: subCategory });
});

const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  // Check if category exists
  if (category) {
    const foundCategory = await Category.findById(category);

    if (!foundCategory) {
      return next(new apiError(`No Category For This Id ${category}`, 404));
    }
  }

  const subCategory = await SubCategory.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name),
      category,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!subCategory) {
    return next(new apiError(`No SubCategory For This Id ${id}`, 404));
  }

  res.status(200).json({
    data: subCategory,
  });
});

//delete subCategory
//@route DELETE /api/v1/subcategories/:id
//@access private
const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new apiError(`No SubCategory For This Id ${id}`, 404));
  }
  res.status(204).send();
});

module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
