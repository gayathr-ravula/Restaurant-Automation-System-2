const createHttpError = require("http-errors");
const MenuItem = require("../models/menuItemModel");
const { default: mongoose } = require("mongoose");

const addMenuItem = async (req, res, next) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res
      .status(201)
      .json({ success: true, message: "Menu item created!", data: menuItem });
  } catch (error) {
    next(error);
  }
};

const getMenuItems = async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find().populate("category");
    res.status(200).json({ success: true, data: menuItems });
  } catch (error) {
    next(error);
  }
};

const getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const menuItem = await MenuItem.findById(id).populate("category");
    if (!menuItem) {
      const error = createHttpError(404, "Menu item not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: menuItem });
  } catch (error) {
    next(error);
  }
};

const getMenuItemsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      const error = createHttpError(404, "Invalid category id!");
      return next(error);
    }

    const menuItems = await MenuItem.find({ category: categoryId }).populate(
      "category"
    );
    res.status(200).json({ success: true, data: menuItems });
  } catch (error) {
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const menuItem = await MenuItem.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!menuItem) {
      const error = createHttpError(404, "Menu item not found!");
      return next(error);
    }

    res
      .status(200)
      .json({ success: true, message: "Menu item updated", data: menuItem });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      const error = createHttpError(404, "Menu item not found!");
      return next(error);
    }

    res
      .status(200)
      .json({ success: true, message: "Menu item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMenuItem,
  getMenuItems,
  getMenuItemById,
  getMenuItemsByCategory,
  updateMenuItem,
  deleteMenuItem,
};
