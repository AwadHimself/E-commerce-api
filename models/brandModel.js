const mongoose = require("mongoose");

//Create schema
const brandySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand Required"],
      unique: [true, "Brand Must Be Unique"],
      minlength: [3, "Brand Name Is Too Short"],
      maxlength: [32, "Brand Name Is Too long"],
    },
    slug: {
      type: String,
      tolowercase: true,
    },
    image: String,
  },
  { timestamps: true },
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

brandySchema.post("init", (doc) => {
  setImageUrl(doc);
});

brandySchema.post("save", (doc) => {
  setImageUrl(doc);
});

//Create model
const Brand = mongoose.model("Brand", brandySchema);

module.exports = Brand;
