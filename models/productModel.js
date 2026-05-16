const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product Required"],
      trim: true,
      minlength: [3, "Product Title Is Too Short"],
      maxlength: [100, "Product Title Is Too long"],
    },

    slug: {
      type: String,
      required: true,
      lowercasr: true,
    },

    description: {
      type: String,
      required: [true, "Product Description is Required"],
      minlength: [20, "Product Description Is Too Short"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is Required"],
    },

    sold: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "Product Price is Required"],
      trim: true,
      max: [500000, "Product Price Is Too high"],
    },

    priceAfterDiscount: {
      type: Number,
      trim: true,
      max: [500000, "Product Price Is Too Long"],
    },

    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image Cover Is Required"],
    },

    images: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product Must Belong To A Category"],
    },

    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },

    ratingsAverage: {
      type: Number,
      min: [1, "Rating Must Be Above Or Equal 1"],
      max: [5, "Rating Must Be Below Or Equal 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
