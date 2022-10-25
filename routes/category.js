const express = require("express");
const router = express.Router();

const Category = require("../controllers/Category");
const verifyToken = require("../routes/verifyToken");

router.get("/", verifyToken, Category.getCategories);
router.get("/:id", verifyToken, Category.getCategoryById);
router.post("/", verifyToken, Category.createCategory);
router.put("/:id", verifyToken, Category.updateCategory);
router.patch("/:id", verifyToken, Category.updateCategory);
router.delete("/:id", verifyToken, Category.deleteCategory);

module.exports = router;
