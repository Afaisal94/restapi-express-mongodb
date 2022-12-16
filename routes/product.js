const express = require("express");
const router = express.Router();

const Product = require("../controllers/Product");

// const verifyToken = require('../routes/verifyToken');
// router.get("/", verifyToken, Product.getProducts);

router.get("/", Product.getProducts);
router.get("/:id", Product.getProductById);
router.post("/", Product.createProduct);
router.put("/:id", Product.updateProduct);
router.patch("/:id", Product.updateProduct);
router.delete("/:id", Product.deleteProduct);

module.exports = router;