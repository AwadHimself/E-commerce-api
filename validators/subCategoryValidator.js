const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id"),
  validatorMiddleware,
];

const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory Name Is Required")
    .isLength({ min: 3, max: 32 })
    .withMessage(
      "SubCategory Name Must Be Longer Than 3 And Less Than 32 Characters",
    ),
  check("category")
    .isMongoId()
    .withMessage("Invalid Category Id")
    .notEmpty()
    .whitelist("SubCategory must be belong to a category"),
  validatorMiddleware,
];

const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id"),

  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Too Short SubCategory Name")
    .isLength({ max: 32 })
    .withMessage("Too Long SubCategory Name"),

  check("category").optional().isMongoId().withMessage("Invalid Category Id"),

  validatorMiddleware,
];

const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id"),
  validatorMiddleware,
];

module.exports = {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
};
