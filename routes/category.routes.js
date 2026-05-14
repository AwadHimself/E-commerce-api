const express = require("express");
const router = express.Router();
const createCategory = require("../services/category.service");

router.post("/", createCategory);

module.exports = router;
