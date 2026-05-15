const CategoryModel = require("../models/categoryModel");
var slugify = require("slugify");
const asyncHandler = require("express-async-handler");

//get list of categories
//@route GET /api/v1/categories
//@access Public
const getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find().skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

//get category by id
//@route GET /api/v1/categories/:id
//@access Public
const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) {
    res.status(404).json({ msg: `No Category For This Id ${id}` });
  }
  res.status(200).json({ data: category });
});

//Update category by id
//@route put /api/v1/categories/:id
//@access private
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await CategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name),
    },
    { new: true },
  );
  if (!category) {
    res.status(404).json({ msg: `No Category For This Id ${id}` });
  }
  res.status(200).json({ data: category });
});

//create category
//@route POST /api/v1/categories
//@access private
const createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

//delete category
//@route DELETE /api/v1/categories/:id
//@access private
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    res.status(404).json({ msg: `No Category For This Id ${id}` });
  }
  res.status(204);
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
