const CategoryModel = require("../models/categoryModel");
var slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const apiError = require("../utils/apiError");
const APIFeatures = require("../utils/apiFeatures");
const factory = require("./handlerFactory");

const { uploadSingleImage } = require("../middlewares/uploadImagesMiddleware");

const uploadCategoryImage = uploadSingleImage("image");

const resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);

    req.body.image = filename;
  }
  next();
});

//get list of categories
//@route GET /api/v1/categories
//@access Public

const getCategories = factory.getAll(CategoryModel);

//get category by id
//@route GET /api/v1/categories/:id
//@access Public
const getCategory = factory.getOne(CategoryModel);

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
  uploadCategoryImage,
  resizeCategoryImage,
};
