const asyncHandler = require("express-async-handler");
const factory = require("./handlerFactory");
const apiError = require("../utils/apiError");

const Order = require("../models//orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Create New Cash Order
// @route POST /api/v1/orders/:cartId
// @access Protected(User)
const createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get The Cart and Calc The Total Order Price
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new apiError("There Is No Cart With This Id", 404));
  }

  let orderPrice;
  if (cart.totalCartPriceAfterDiscount) {
    orderPrice = cart.totalCartPriceAfterDiscount;
  } else {
    orderPrice = cart.totalCartPrice;
  }

  const totalOrderPrice = orderPrice + taxPrice + shippingPrice;

  //2) Create The Order
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  //3)Update The Product Quantity And Sold And Clear The Cart
  if (order) {
    const bulkOpts = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOpts, {});

    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "success", order: order });
});

const filterOrdersForLoggedUsers = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }

  next();
});
// Get All Orders
// @route GET /api/v1/orders
// @access Protected(admin , manger , user)
const getAllOrders = factory.getAll(Order);

// Get Specific Order
// @route GET /api/v1/orders/:orderId
// @access Protected(admin , manger , user)
const getSpecificOrder = factory.getOne(Order);

// Update Order Paid Status Paid
// @route PUT /api/v1/orders/:orderId/pay
// @access Protected(admin , manger , user)
const updatePaidStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    {
      isPaid: true,
      paidAt: Date.now(),
    },
    { new: true },
  );

  if (!order) {
    return next(
      new apiError(`No Order Found With Id ${req.params.orderId}`, 404),
    );
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

// Update Order delivered Status
// @route PUT /api/v1/orders/:orderId/deliver
// @access Protected(admin , manger , user)
const updateDeliveredStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    {
      isDelivered: true,
      deliveredAt: Date.now(),
    },
    { new: true },
  );

  if (!order) {
    return next(
      new apiError(`No Order Found With Id ${req.params.orderId}`, 404),
    );
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

module.exports = {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
  filterOrdersForLoggedUsers,
  updatePaidStatus,
  updateDeliveredStatus,
};
