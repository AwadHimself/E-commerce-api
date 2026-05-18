var slugify = require("slugify");
const APIFeatures = require("../utils/apiFeatures");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const mongoose = require("mongoose");

const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlerFactory");

//get list of subCategories
//@route GET /api/v1/subcategories
//@access Public
const getSubCategories = asyncHandler(async (req, res) => {
  //build Query
  const countDocuments = await SubCategory.countDocuments();
  const features = new APIFeatures(SubCategory.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(countDocuments);

  const { query, paginationResult } = features;

  const subCategories = await query;
  res.status(200).json({
    results: subCategories.length,
    paginationResult,
    data: subCategories,
  });
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
const deleteSubCategory = factory.deleteOne(SubCategory);

module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
