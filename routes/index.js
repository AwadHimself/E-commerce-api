const CategoryRoute = require("./category.routes");
const brandRoute = require("./brand.routes");
const SubCategoryRoute = require("./subCategory.routes");
const productRoutes = require("./product.routes");
const wishlistRoutes = require("./wishlist.routes");
const addressRoutes = require("./adddress.routes");
const couponRoutes = require("./coupon.routes");
const userRoutes = require("./user.routes");
const reviewRoutes = require("./review.routes");
const authRoutes = require("./auth.routes");
const cartRoutes = require("./cart.routes");
const orderRoutes = require("./oder.routes");

const mountRoutes = (app) => {
  app.get("/", (req, res) => {
    res.send("Our API V1");
  });

  //routes
  app.use("/api/v1/categories", CategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/subcategories", SubCategoryRoute);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/reviews", reviewRoutes);
  app.use("/api/v1/wishlist", wishlistRoutes);
  app.use("/api/v1/addresses", addressRoutes);
  app.use("/api/v1/coupons", couponRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/cart", cartRoutes);
  app.use("/api/v1/orders", orderRoutes);
};

module.exports = mountRoutes;
