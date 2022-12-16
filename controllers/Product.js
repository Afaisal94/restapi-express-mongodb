const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");

const getProducts = async (req, res) => {
  const name = req.query.name;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  let condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  try {
    const products = await Product.find(condition)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: "category", select: "_id name" })
      .sort("name");

    const totalProducts = await Product.find(condition);

    res.status(200).json({
      products: products,
      total_products: totalProducts.length,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id }).populate({
      path: "category",
      select: "_id name",
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const createProduct = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ message: "No File Uploaded" });

  const file = req.files.image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ message: "Image must be less than 5 MB" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ message: err.message });
    try {
      const createProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        image: fileName,
        imageUrl: url,
      });
      const product = await createProduct.save();
      res.status(201).json({
        message: "Product Created Successfuly",
        data: product,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

const updateProduct = async (req, res) => {
  const product = await Product.findById({ _id: req.params.id });
  if (!product) return res.status(404).json({ message: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = product.image;
  } else {
    const file = req.files.image;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ message: "Image must be less than 5 MB" });

    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);
    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ message: err.message });
    });
  }

  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await Product.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        image: fileName,
        imageUrl: url,
      }
    );
    res.status(201).json({
      message: "Product Updated Successfuly",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Post successfully deleted",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
