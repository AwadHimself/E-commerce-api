const CategoryModel = require("../models/categoryModel");
var slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const APIFeatures = require("../utils/apiFeatures");
const factory = require("./handlerFactory");

//get list of categories
//@route GET /api/v1/categories
//@access Public
const getCategories = asyncHandler(async (req, res) => {
  //build Query
  const countDocuments = await CategoryModel.countDocuments();
  const features = new APIFeatures(CategoryModel.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(countDocuments);

  const { query, paginationResult } = features;
  const categories = await query;
  res
    .status(200)
    .json({ results: categories.length, paginationResult, data: categories });
});

//get category by id
//@route GET /api/v1/categories/:id
//@access Public
const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new apiError(`No Category For This Id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

//Update category by id
//@route put /api/v1/categories/:id
//@access private
const updateCategory = factory.updateOne(CategoryModel);

//create category
//@route POST /api/v1/categories
//@access private
const createCategory = factory.createOne(CategoryModel);

//delete category
//@route DELETE /api/v1/categories/:id
//@access private
const deleteCategory = factory.deleteOne(CategoryModel);

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
