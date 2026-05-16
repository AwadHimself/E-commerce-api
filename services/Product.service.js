const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
var slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");

//get list of Products
//@route GET /api/v1/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const products = await Product.find().skip(skip).limit(limit).populate({
    path: "category",
    select: "name , id",
  });
  res.status(200).json({ results: products.length, page, data: products });
});

//get product by id
//@route GET /api/v1/products/:id
//@access Public
const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name , id",
  });
  if (!product) {
    return next(new apiError(`No Product For This Id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

//Update Product by id
//@route put /api/v1/products/:id
//@access private
const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.aborted.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
  if (!product) {
    next(new apiError(`No Product For This Id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

//create Product
//@route POST /api/v1/products
//@access private
const createProduct = asyncHandler(async (req, res, next) => {
  // 1. Check if category exists
  const foundCategory = await Category.findById(req.body.category);

  if (!foundCategory) {
    return next(
      new apiError(`No Category For This Id ${req.body.category}`, 404),
    );
  }
  // 2. Create slug
  req.body.slug = slugify(req.body.title);

  // 3. Create product
  const product = await Product.create(req.body);

  res.status(201).json({ data: product });
});
//delete product
//@route DELETE /api/v1/products/:id
//@access private
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new apiError(`No Product For This Id ${id}`, 404));
  }
  res.status(204).send();
});

module.exports = {
  getProducts,
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
};
