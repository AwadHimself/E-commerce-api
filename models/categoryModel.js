const mongoose = require("mongoose");

//Create schema
const categorySchema = mongoose.Schema({
  name: String,
});

//Create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
