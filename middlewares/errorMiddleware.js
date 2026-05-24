const apiError = require("../utils/apiError");

// Development Error
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Production Error
const sendErrorProd = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Something went wrong",
  });
};

const handleJwtInvalidSignature = () =>
  new apiError("Invaild Token, Please Login Again", 401);

const handleJwtExpired = () =>
  new apiError("Token Expired , Please Login Again", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "dev") {
    sendErrorDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJwtExpired();
    sendErrorProd(err, res);
  }
};

module.exports = globalError;
