const mongoose = require("mongoose"); // Erase if already required

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Coupon Name Is Required"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon Expire Time Is Required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon Discount Is Required"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Coupon", couponSchema);
