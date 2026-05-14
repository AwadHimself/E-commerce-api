const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });

const app = express();

const dbConnection = require("./config/database");
const CategoryRoute = require("./routes/category.routes");

dbConnection();

//middleware
app.use(express.json());
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

//routes
app.get("/", (req, res) => {
  res.send("Our API V1");
});

app.use("/api/v1/categories", CategoryRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
