const express = require("express");
const router = express.Router();
const { upload } = require("../multer");

const Product = require("../controllers/Product");
const verifyToken = require('../routes/verifyToken');

router.get("/", verifyToken, Product.getProducts);
router.get("/:id", verifyToken, Product.getProductById);
router.post("/", verifyToken, upload.single("image"), Product.createProduct);
router.put("/:id", verifyToken, upload.single("image"), Product.updateProduct);
router.patch("/:id", verifyToken, upload.single("image"), Product.updateProduct);
router.delete("/:id", verifyToken, Product.deleteProduct);

module.exports = router;