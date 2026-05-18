const APIFeatures = require("../utils/apiFeatures");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new apiError(`No Document For This Id ${id}`, 404));
    }
    res.status(204).send();
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(new apiError(`No Document For This Id ${id}`, 404));
    }

    res.status(200).json({ data: document });
  });
