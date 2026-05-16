const mongoose = require("mongoose");

//Create schema
const brandySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brandy Required"],
      unique: [true, "Brandy Must Be Unique"],
      minlength: [3, "Brandy Name Is Too Short"],
      maxlength: [32, "Brandy Name Is Too long"],
    },
    slug: {
      type: String,
      tolowercase: true,
    },
    image: String,
  },
  { timestamps: true },
);

//Create model
const Brand = mongoose.model("Brand", brandySchema);

module.exports = Brand;
