const mongoose = require("mongoose");

//Create schema
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Required"],
      unique: [true, "Category Must Be Unique"],
      minlength: [3, "Category Name Is Too Short"],
      maxlength: [32, "Category Name Is Too long"],
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
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});

categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

//Create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
