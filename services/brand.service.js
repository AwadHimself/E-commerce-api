const Brand = require("../models/brandModel");
var slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");

//get list of Brands
//@route GET /api/v1/Brands
//@access Public
const getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const brand = await Brand.find().skip(skip).limit(limit);
  res.status(200).json({ results: brand.length, page, data: brand });
});

//get Brand by id
//@route GET /api/v1/Brands/:id
//@access Public
const getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new apiError(`No Brand For This Id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

//Update Brand by id
//@route put /api/v1/categories/:id
//@access private
const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name),
    },
    { new: true },
  );

  if (!brand) {
    return next(new apiError(`No Brand For This Id ${id}`, 404));
  }

  res.status(200).json({ data: brand });
});
//create Brand
//@route POST /api/v1/brands
//@access private
const createBrand = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

//delete brand
//@route DELETE /api/v1/brands/:id
//@access private
const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return next(new apiError(`No Brand For This Id ${id}`, 404));
  }
  res.status(204).send();
});

module.exports = {
  getBrands,
  getBrand,
  updateBrand,
  createBrand,
  deleteBrand,
};
