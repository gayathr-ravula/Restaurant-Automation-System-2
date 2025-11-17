const createHttpError = require("http-errors");
const Category = require("../models/categoryModel");
const { default: mongoose } = require("mongoose");

const addCategory = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res
      .status(201)
      .json({ success: true, message: "Category created!", data: category });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const category = await Category.findById(id);
    if (!category) {
      const error = createHttpError(404, "Category not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!category) {
      const error = createHttpError(404, "Category not found!");
      return next(error);
    }

    res
      .status(200)
      .json({ success: true, message: "Category updated", data: category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      const error = createHttpError(404, "Category not found!");
      return next(error);
    }

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
