const { check, body } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const slugify = require("slugify");

const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id"),
  validatorMiddleware,
];

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category Name Is Required")
    .isLength({ min: 3, max: 32 })
    .withMessage(
      "Category Name Must Be Longer Than 3 And Less Than 32 Characters",
    ),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  validatorMiddleware,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  validatorMiddleware,
];

const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id"),
  validatorMiddleware,
];

module.exports = {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
