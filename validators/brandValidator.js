const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id"),
  validatorMiddleware,
];

const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand Name Is Required")
    .isLength({ min: 3, max: 32 })
    .withMessage(
      "Brand Name Must Be Longer Than 3 And Less Than 32 Characters",
    ),
  validatorMiddleware,
];

const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id"),
  validatorMiddleware,
];

const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id"),
  validatorMiddleware,
];

module.exports = {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
};
