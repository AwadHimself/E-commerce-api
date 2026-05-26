const APIFeatures = require("../utils/apiFeatures");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    // Build filter object
    let filter = {};

    if (req.filterObj) {
      filter = req.filterObj;
    }

    const countDocuments = await Model.countDocuments(filter);

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate(countDocuments);

    const { query, paginationResult } = features;

    const docs = await query;

    res.status(200).json({
      results: docs.length,
      paginationResult,
      data: docs,
    });
  });
exports.getOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const doc = await query;

    if (!doc) {
      return next(
        new apiError(`No document found for this id ${req.params.id}`, 404),
      );
    }

    res.status(200).json({
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findById(id);

    if (!document) {
      return next(new apiError(`No Document For This Id ${id}`, 404));
    }

    await document.deleteOne();

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
      new apiError(`No Document For This Id ${req.params.id}`, 404);
    }
    document.save();
    res.status(200).json({ data: document });
  });
