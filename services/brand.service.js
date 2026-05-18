const Brand = require("../models/brandModel");
var slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const APIFeatures = require("../utils/apiFeatures");
const factory = require("./handlerFactory");

//get list of Brands
//@route GET /api/v1/Brands
//@access Public
const getBrands = asyncHandler(async (req, res) => {
  //build Query
  const countDocuments = await Brand.countDocuments();
  const features = new APIFeatures(Brand.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate(countDocuments);

  const { query, paginationResult } = features;

  const brand = await query;
  res
    .status(200)
    .json({ results: brand.length, paginationResult, data: brand });
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
const updateBrand = factory.updateOne(Brand);
//create Brand
//@route POST /api/v1/brands
//@access private
const createBrand = factory.createOne(Brand);
//delete brand
//@route DELETE /api/v1/brands/:id
//@access private
const deleteBrand = factory.deleteOne(Brand);

module.exports = {
  getBrands,
  getBrand,
  updateBrand,
  createBrand,
  deleteBrand,
};
