const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });

const app = express();
app.set("query parser", "extended");

const apiError = require("./utils/apiError");
const dbConnection = require("./config/database");
const globalError = require("./middlewares/errorMiddleware");

const mountRoutes = require("./routes");

dbConnection();

//middleware
app.use(express.json());

app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

//routes
mountRoutes(app);

app.use((req, res, next) => {
  next(new apiError("This route is not defined", 404));
});

//global error handlig middleware inside express
app.use(globalError);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});

//handle errors outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting Down....");
    process.exit(1);
  });
});
