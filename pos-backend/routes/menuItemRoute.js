const express = require("express");
const {
  addMenuItem,
  getMenuItems,
  getMenuItemById,
  getMenuItemsByCategory,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuItemController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();

router.route("/").post(isVerifiedUser, addMenuItem);
router.route("/").get(isVerifiedUser, getMenuItems);
router.route("/:id").get(isVerifiedUser, getMenuItemById);
router.route("/:id").put(isVerifiedUser, updateMenuItem);
router.route("/:id").delete(isVerifiedUser, deleteMenuItem);
router.route("/category/:categoryId").get(isVerifiedUser, getMenuItemsByCategory);

module.exports = router;
