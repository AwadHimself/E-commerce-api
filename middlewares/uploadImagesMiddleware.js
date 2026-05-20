const multer = require("multer");
const apiError = require("../utils/apiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new apiError("Only Images Are Allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

const uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

const uploadMixOfImages = (array) => multerOptions().fields(array);

module.exports = {
  uploadSingleImage,
  uploadMixOfImages,
};
