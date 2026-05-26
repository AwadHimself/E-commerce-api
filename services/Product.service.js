const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
var slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const APIFeatures = require("../utils/apiFeatures");
const apiError = require("../utils/apiError");
const factory = require("./handlerFactory");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadMixOfImages } = require("../middlewares//uploadImagesMiddleware");

//get list of Products
//@route GET /api/v1/products
//@access Public
const getProducts = factory.getAll(Product);

//get product by id
//@route GET /api/v1/products/:id
//@access Public
const getProduct = factory.getOne(Product, "reviews");

//Update Product by id
//@route put /api/v1/products/:id
//@access private
const updateProduct = factory.updateOne(Product);

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
const deleteProduct = factory.deleteOne(Product);

//upload images
const uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

// images processing
const resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index}.jpeg`;

        await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        req.body.images.push(imageName);
      }),
    );
    next();
  }
});

module.exports = {
  getProducts,
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
};
