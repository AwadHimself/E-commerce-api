const mongoose = require("mongoose");
const Product = require("../models/productModel");

const reviewSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min Rating Value Is 1.0"],
      max: [5, "max Rating Value Is 5.0"],
      required: [true, "Rating Is Required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review Must Belong To A User"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review Must Belong To A Product"],
    },
  },
  { timestamps: true },
);

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name",
  });
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  ProductId,
) {
  const stats = await this.aggregate([
    { $match: { product: ProductId } },
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(ProductId, {
      ratingsAverage: stats[0].avgRatings,
      ratingsQuantity: stats[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(ProductId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
  },
);
const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
