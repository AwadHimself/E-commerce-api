const mongoose = require("mongoose");
const dotenv = require("dotenv");

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((con) => {
      console.log(`DB Connected : ${con.connection.host}`);
    })
    .catch((err) => {
      console.error(`DB Error : ${err}`);
      process.exit;
    });
};

module.exports = dbConnection;
